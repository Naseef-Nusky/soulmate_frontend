import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { emailLogin, verifyLoginToken, checkAccountExists, signup } from '../lib/api.js';
import { setUser } from '../lib/auth.js';
import { applyTranslation } from '../lib/translation.js';

export default function Login({ isRegister = false }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    confirmEmail: '',
    name: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    agreedToTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const today = new Date();
  const maxBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  const minBirthDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
  const maxBirthDateStr = maxBirthDate.toISOString().split('T')[0];
  const minBirthDateStr = minBirthDate.toISOString().split('T')[0];

  const birthInputValue =
    formData.birthYear && formData.birthMonth && formData.birthDay
      ? `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`
      : '';

  const handleBirthDateChange = (value) => {
    if (!value) {
      setFormData((prev) => ({
        ...prev,
        birthDay: '',
        birthMonth: '',
        birthYear: '',
      }));
      return;
    }
    const [year, month, day] = value.split('-');
    setFormData((prev) => ({
      ...prev,
      birthDay: day,
      birthMonth: month,
      birthYear: year,
    }));
  };

  // Check for login token in URL
  useEffect(() => {
    const token = searchParams.get('token');
    if (token && !isRegister) {
      handleTokenLogin(token);
    }
  }, [searchParams, isRegister]);

  // Handle payment success from Stripe Checkout or Custom Checkout
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const subscriptionId = searchParams.get('subscription_id');
    const paymentSuccess = searchParams.get('payment');
    
    if (paymentSuccess === 'success' && !isRegister) {
      if (sessionId) {
        handlePaymentSuccess(sessionId);
      } else if (subscriptionId) {
        handlePaymentSuccess(null, subscriptionId);
      }
    }
  }, [searchParams, isRegister]);

  // Re-apply translation when component mounts or language changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Apply translation on mount
    const state = window.__GuruLinkTranslationState;
    if (state?.lang && state.lang !== 'en') {
      setTimeout(() => {
        applyTranslation(state.lang, { silent: true });
      }, 500);
    }

    // Listen for language changes
    const handleLanguageChange = (event) => {
      const lang = event?.detail?.lang || window.__GuruLinkTranslationState?.lang;
      if (lang && lang !== 'en') {
        setTimeout(() => {
          applyTranslation(lang, { silent: true });
        }, 400);
      }
    };

    window.addEventListener('gurulink:language-applied', handleLanguageChange);
    return () => window.removeEventListener('gurulink:language-applied', handleLanguageChange);
  }, []);

  const handlePaymentSuccess = async (sessionId, subscriptionId = null) => {
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      // Get user data from localStorage (stored before checkout)
      const pendingSignup = localStorage.getItem('pendingSignup');
      if (!pendingSignup) {
        setError('Unable to find payment details. Please contact support with your payment confirmation.');
        setLoading(false);
        return;
      }

      const { email, name, birthDate } = JSON.parse(pendingSignup);
      
      // Get quiz data from localStorage (saved when quiz was completed)
      // Also check all localStorage keys to find quiz data
      let quizDataStr = localStorage.getItem('quizData');
      let quizData = null;
      
      // If not found, try to find it in other possible keys
      if (!quizDataStr) {
        console.log('[Login] Quiz data not found in "quizData" key, checking other keys...');
        // Check if there's quiz data stored with a different key
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.toLowerCase().includes('quiz')) {
            console.log(`[Login] Found potential quiz data in key: ${key}`);
            quizDataStr = localStorage.getItem(key);
            break;
          }
        }
      }
      
      if (quizDataStr) {
        try {
          quizData = JSON.parse(quizDataStr);
          
          // Update email in quiz data to match payment email
          if (quizData.answers) {
            quizData.email = email.trim().toLowerCase();
            // Ensure birth details are set
            if (!quizData.birthDetails && quizData.answers) {
              quizData.birthDetails = {
                date: quizData.answers.birthDate || null,
                time: quizData.answers.birthTime || null,
                city: quizData.answers.birthCity || null,
              };
            }
          }
          
          console.log('[Login] ✅ Quiz data found in localStorage:', {
            hasAnswers: !!quizData.answers,
            hasBirthDetails: !!quizData.birthDetails,
            email: quizData.email,
            answerKeys: quizData.answers ? Object.keys(quizData.answers) : [],
            answerCount: quizData.answers ? Object.keys(quizData.answers).length : 0,
          });
        } catch (e) {
          console.error('[Login] Failed to parse quiz data from localStorage:', e);
        }
      } else {
        console.warn('[Login] ⚠️ No quiz data found in localStorage');
        console.warn('[Login] Available localStorage keys:', Object.keys(localStorage));
      }

      // Create account with payment session and quiz data
      console.log('[Login] Sending registration request:', {
        email,
        hasQuizData: !!quizData,
        hasAnswers: !!quizData?.answers,
        quizDataSize: quizData ? JSON.stringify(quizData).length : 0,
      });
      
      const result = await signup({
        email,
        name,
        birthDate,
        sessionId: sessionId || undefined,
        subscriptionId: subscriptionId || undefined,
        quizData, // Send quiz data so backend can save it and generate everything
      });

      // Only clear localStorage data after successful registration AND if quiz data was sent
      localStorage.removeItem('pendingSignup');
      // Don't clear quizData yet - keep it in case we need to retry
      // Only clear it after we confirm generation succeeded
      if (result.ok && quizData) {
        console.log('[Login] ✅ Registration successful, quiz data was sent. Keeping quizData in localStorage for now.');
        // We'll clear it later after confirming generation worked
      }

      if (result.ok) {
        setMessage('Payment successful! Please check your email for your secure login link.');
        // User will receive login link via email
      } else {
        // Check if error is about payment not completed
        if (result.error && result.error.includes('Payment has not been completed')) {
          setError('Payment was not completed. Please return to the checkout page to complete your payment.');
          // Optionally redirect back to checkout after a delay
          setTimeout(() => {
            const pendingSignup = JSON.parse(localStorage.getItem('pendingSignup') || '{}');
            if (pendingSignup.email) {
              navigate(`/checkout?email=${encodeURIComponent(pendingSignup.email)}`);
            }
          }, 3000);
        } else {
          setError(result.error || 'Account creation failed. Please contact support.');
        }
      }
    } catch (err) {
      // Check if error is about payment not completed
      if (err.message && err.message.includes('Payment has not been completed')) {
        setError('Payment was not completed. Please return to the checkout page to complete your payment.');
        // Redirect back to checkout
        setTimeout(() => {
          const pendingSignup = JSON.parse(localStorage.getItem('pendingSignup') || '{}');
          if (pendingSignup.email) {
            navigate(`/checkout?email=${encodeURIComponent(pendingSignup.email)}`);
          }
        }, 3000);
      } else {
        setError(err.message || 'Payment succeeded but account setup failed. Please contact support.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTokenLogin = async (token) => {
    setLoading(true);
    setError('');
    try {
      const result = await verifyLoginToken(token);
      if (result.ok && result.user && result.token) {
        setUser(result.user, result.token);
        // Store horoscope if provided (for first login)
        if (result.horoscope) {
          localStorage.setItem('initialHoroscope', JSON.stringify(result.horoscope));
        }
        
        // Check for redirect params in URL
        const redirect = searchParams.get('redirect');
        const tab = searchParams.get('tab');
        const showSoulmate = searchParams.get('showSoulmate');
        
        if (redirect === 'dashboard') {
          let dashboardUrl = '/dashboard';
          const params = new URLSearchParams();
          if (tab) params.set('tab', tab);
          if (showSoulmate) params.set('showSoulmate', showSoulmate);
          if (params.toString()) {
            dashboardUrl += '?' + params.toString();
          }
          navigate(dashboardUrl);
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Invalid or expired login link');
      }
    } catch (err) {
      setError(err.message || 'Failed to verify login link');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isRegister) {
        // Validate email match
        if (formData.email.trim() !== formData.confirmEmail.trim()) {
          setError('Emails do not match');
          setLoading(false);
          return;
        }

        // Validate terms agreement
        if (!formData.agreedToTerms) {
          setError('You must agree to the Terms & Conditions and Privacy Policy');
          setLoading(false);
          return;
        }

        // Validate birth date & age
        const dayNum = parseInt(formData.birthDay, 10);
        const monthNum = parseInt(formData.birthMonth, 10);
        const yearNum = parseInt(formData.birthYear, 10);

        if (
          Number.isNaN(dayNum) ||
          Number.isNaN(monthNum) ||
          Number.isNaN(yearNum) ||
          dayNum < 1 ||
          dayNum > 31 ||
          monthNum < 1 ||
          monthNum > 12 ||
          yearNum < 1900
        ) {
          setError('Please enter a valid birth date');
          setLoading(false);
          return;
        }

        const birthDateObj = new Date(yearNum, monthNum - 1, dayNum);
        const isValidDate =
          birthDateObj.getFullYear() === yearNum &&
          birthDateObj.getMonth() === monthNum - 1 &&
          birthDateObj.getDate() === dayNum;

        if (!isValidDate) {
          setError('Please enter a valid birth date');
          setLoading(false);
          return;
        }

        const today = new Date();
        const cutoff = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        if (birthDateObj > cutoff) {
          setError('You must be at least 18 years old to sign up');
          setLoading(false);
          return;
        }

        // Check if account already exists
        const cleanedEmail = formData.email.trim().toLowerCase();
        try {
          const accountCheck = await checkAccountExists(cleanedEmail);
          if (accountCheck.exists) {
            setError('An account with this email already exists. Please sign in instead.');
            setLoading(false);
            // Redirect to login page after 2 seconds
            setTimeout(() => {
              navigate('/login');
            }, 2000);
            return;
          }
        } catch (err) {
          console.error('Failed to check account existence:', err);
          // Continue with signup if check fails (don't block user)
        }

        // Format birth date
        let birthDate = null;
        if (formData.birthDay && formData.birthMonth && formData.birthYear) {
          // Convert dd/mm/yyyy to yyyy-mm-dd format
          const day = formData.birthDay.padStart(2, '0');
          const month = formData.birthMonth.padStart(2, '0');
          const year = formData.birthYear;
          birthDate = `${year}-${month}-${day}`;
        }

        // Store signup email in localStorage so quiz can auto-fill it
        const signupEmail = formData.email.trim().toLowerCase();
        localStorage.setItem('signupEmail', signupEmail);
        console.log('[Login] Signup email stored for quiz auto-fill:', signupEmail);

        // Navigate to quiz with register path to indicate coming from signup
        navigate('/register/quiz');
        return;
      } else {
        if (!formData.email) {
          setError('Please enter your email address');
          setLoading(false);
          return;
        }
        const result = await emailLogin(formData.email.trim());
        if (result.message) {
          setMessage(result.message);
          // Don't navigate - wait for user to click email link
          return;
        }
        // If token returned (shouldn't happen with new flow, but handle it)
        if (result.token && result.user) {
          setUser(result.user, result.token);
          navigate('/dashboard');
          return;
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/logoicon.png" alt="GuruLink" className="h-10 w-10 object-contain" />
            <div className="text-3xl font-black" style={{ color: '#1A2336' }} data-notranslate>
              GuruLink<span style={{ color: '#D4A34B' }}>.app</span>
            </div>
          </div>
          <h1 className="text-3xl font-black mb-2" style={{ color: '#1A2336' }}>
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p style={{ color: '#666' }}>
            {isRegister ? 'Start your astrological journey today' : 'Sign in to access your personalized readings'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border p-8" style={{ borderColor: 'rgba(212, 163, 75, 0.3)' }}>
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#dc2626' }}>
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-4 rounded-lg text-sm" style={{ backgroundColor: 'rgba(212, 163, 75, 0.1)', color: '#1A2336', border: '1px solid rgba(212, 163, 75, 0.3)' }}>
              <p className="font-semibold mb-2">✓ {message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1A2336' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border"
                    style={{ 
                      borderColor: 'rgba(212, 163, 75, 0.3)',
                      backgroundColor: '#F9F9F9',
                      color: '#1A2336'
                    }}
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1A2336' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border"
                    style={{ 
                      borderColor: 'rgba(212, 163, 75, 0.3)',
                      backgroundColor: '#F9F9F9'
                    }}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1A2336' }}>
                    Confirm Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.confirmEmail}
                    onChange={(e) => setFormData({ ...formData, confirmEmail: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border"
                    style={{ 
                      borderColor: 'rgba(212, 163, 75, 0.3)',
                      backgroundColor: '#F9F9F9',
                      color: '#1A2336'
                    }}
                    placeholder="confirm@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1A2336' }}>
                    Birth Date
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      required
                      value={birthInputValue}
                      onChange={(e) => handleBirthDateChange(e.target.value)}
                      min={minBirthDateStr}
                      max={maxBirthDateStr}
                      className="w-full px-4 py-3 rounded-lg border"
                      style={{
                        borderColor: 'rgba(212, 163, 75, 0.3)',
                        backgroundColor: '#F9F9F9',
                        color: '#1A2336'
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            {!isRegister && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1A2336' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border"
                    style={{ 
                      borderColor: 'rgba(212, 163, 75, 0.3)',
                      backgroundColor: '#F9F9F9',
                      color: '#1A2336'
                    }}
                    placeholder="your@email.com"
                  />
                </div>
              </>
            )}

            {isRegister && (
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreedToTerms}
                  onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                  className="mt-1"
                  style={{ accentColor: '#D4A34B' }}
                />
                <label className="text-sm" style={{ color: '#666' }}>
                  I have read and agree to <span data-notranslate>GuruLink</span>'s{' '}
                  <Link to="/terms" className="underline" style={{ color: '#D4A34B' }}>Terms &amp; Conditions</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="underline" style={{ color: '#D4A34B' }}>Privacy Policy</Link>.
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg font-bold text-lg transition-all shadow-lg disabled:opacity-50"
              style={{ backgroundColor: '#1A2336', color: '#F5F5F5' }}
              onMouseEnter={(e) => !e.disabled && (e.currentTarget.style.backgroundColor = '#D4A34B', e.currentTarget.style.color = '#1A2336')}
              onMouseLeave={(e) => !e.disabled && (e.currentTarget.style.backgroundColor = '#1A2336', e.currentTarget.style.color = '#F5F5F5')}
            >
              {loading ? 'Please wait...' : (isRegister ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: '#666' }}>
              {isRegister ? 'Already have an account? ' : "Don't have an account? "}
              <Link
                to={isRegister ? '/login' : '/register'}
                className="font-semibold"
                style={{ color: '#D4A34B' }}
              >
                {isRegister ? 'Sign In' : 'Sign Up'}
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-sm"
            style={{ color: '#666', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ← Back
          </button>
        </div>
      </div>

    </div>
  );
}



