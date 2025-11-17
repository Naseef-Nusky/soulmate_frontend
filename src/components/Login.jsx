import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { signup, emailLogin, verifyLoginToken, createPaymentIntent } from '../lib/api.js';
import { detectCurrency, getPricing } from '../utils/currency.js';
import { setUser } from '../lib/auth.js';
import PaymentDialog from './PaymentDialog.jsx';

const publishableKey = import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

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
  const [paymentState, setPaymentState] = useState(null);

  // Check for login token in URL
  useEffect(() => {
    const token = searchParams.get('token');
    if (token && !isRegister) {
      handleTokenLogin(token);
    }
  }, [searchParams, isRegister]);

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

        // Format birth date
        let birthDate = null;
        if (formData.birthDay && formData.birthMonth && formData.birthYear) {
          // Convert dd/mm/yyyy to yyyy-mm-dd format
          const day = formData.birthDay.padStart(2, '0');
          const month = formData.birthMonth.padStart(2, '0');
          const year = formData.birthYear;
          birthDate = `${year}-${month}-${day}`;
        }
        if (!stripePromise) {
          setError('Stripe is not configured. Please try again later.');
          setLoading(false);
          return;
        }

        const cleanedEmail = formData.email.trim();
        const currency = detectCurrency();
        const pricing = getPricing(currency);
        const paymentInit = await createPaymentIntent({
          email: cleanedEmail,
          name: formData.name?.trim() || null,
          birthDate,
          currency,
        });

        setPaymentState({
          clientSecret: paymentInit.clientSecret,
          paymentIntentId: paymentInit.paymentIntentId,
          registrationPayload: {
            email: cleanedEmail,
            name: formData.name?.trim() || null,
            birthDate,
            paymentIntentId: paymentInit.paymentIntentId,
          },
          amountLabel: paymentInit.displayAmount || pricing.trial.formatted,
          currencyLabel: paymentInit.currency || currency,
          email: cleanedEmail,
        });
        setLoading(false);
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
      // For registration, go to quiz
      if (isRegister) {
        navigate('/quiz');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (confirmedPaymentId) => {
    if (!paymentState) return;
    setLoading(true);
    setError('');
    try {
      const result = await signup({
        ...paymentState.registrationPayload,
        paymentIntentId: confirmedPaymentId || paymentState.paymentIntentId,
      });

      if (result.ok) {
        if (result.horoscope) {
          localStorage.setItem('initialHoroscope', JSON.stringify(result.horoscope));
        }
        setPaymentState(null);
        setMessage('Payment successful! Please check your inbox for your secure login link.');
        setTimeout(() => {
          navigate('/login');
        }, 1800);
        return;
      }
      setError('Registration failed after payment. Please contact support.');
    } catch (err) {
      setError(err.message || 'Unable to finalize registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPayment = () => {
    setPaymentState(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/logoicon.png" alt="GuruLink" className="h-10 w-10 object-contain" />
            <div className="text-3xl font-black" style={{ color: '#1A2336' }}>
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
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      required
                      maxLength={2}
                      value={formData.birthDay}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                        setFormData({ ...formData, birthDay: value });
                      }}
                      className="w-full sm:w-20 px-4 py-3 rounded-lg border text-center"
                      style={{ 
                        borderColor: 'rgba(212, 163, 75, 0.3)',
                        backgroundColor: '#F9F9F9',
                        color: '#1A2336'
                      }}
                      placeholder="dd"
                    />
                    <span className="hidden sm:flex items-center text-lg font-bold" style={{ color: '#666' }}>/</span>
                    <input
                      type="text"
                      required
                      maxLength={2}
                      value={formData.birthMonth}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                        setFormData({ ...formData, birthMonth: value });
                      }}
                      className="w-full sm:w-20 px-4 py-3 rounded-lg border text-center"
                      style={{ 
                        borderColor: 'rgba(212, 163, 75, 0.3)',
                        backgroundColor: '#F9F9F9',
                        color: '#1A2336'
                      }}
                      placeholder="mm"
                    />
                    <span className="hidden sm:flex items-center text-lg font-bold" style={{ color: '#666' }}>/</span>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={formData.birthYear}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setFormData({ ...formData, birthYear: value });
                      }}
                      className="w-full sm:w-24 px-4 py-3 rounded-lg border text-center"
                      style={{ 
                        borderColor: 'rgba(212, 163, 75, 0.3)',
                        backgroundColor: '#F9F9F9',
                        color: '#1A2336'
                      }}
                      placeholder="yyyy"
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
                  I have read and agree to GuruLink's{' '}
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
          <Link
            to="/"
            className="text-sm"
            style={{ color: '#666' }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {paymentState?.clientSecret && stripePromise && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: paymentState.clientSecret, appearance: { theme: 'flat' } }}
        >
          <PaymentDialog
            amountLabel={paymentState.amountLabel}
            currencyLabel={paymentState.currencyLabel}
            email={paymentState.email}
            onCancel={handleCancelPayment}
            onSuccess={handlePaymentSuccess}
          />
        </Elements>
      )}
    </div>
  );
}



