import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendCancellationVerificationCode, verifyCodeAndCancel } from '../lib/api.js';

export default function CancellationPortal() {
  const navigate = useNavigate();

  // Re-apply translation when component mounts or language changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.__GuruLinkTranslationState?.lang) {
      const lang = window.__GuruLinkTranslationState.lang;
      if (lang !== 'en') {
        setTimeout(() => {
          if (window.__GuruLinkTranslationState?.reapply) {
            window.__GuruLinkTranslationState.reapply();
          }
        }, 300);
      }
    }

    const handleLanguageChange = () => {
      if (window.__GuruLinkTranslationState?.lang && window.__GuruLinkTranslationState.lang !== 'en') {
        setTimeout(() => {
          if (window.__GuruLinkTranslationState?.reapply) {
            window.__GuruLinkTranslationState.reapply();
          }
        }, 200);
      }
    };

    window.addEventListener('gurulink:language-applied', handleLanguageChange);
    return () => window.removeEventListener('gurulink:language-applied', handleLanguageChange);
  }, []);
  const [step, setStep] = useState('email'); // 'email', 'verify', 'success'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [cancellationData, setCancellationData] = useState(null);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      const result = await sendCancellationVerificationCode(email);
      
      if (result.ok) {
        setMessage('Verification code sent! Please check your email.');
        setStep('verify');
      } else {
        setError(result.error || 'Failed to send verification code. Please try again or contact support.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again or contact support at help@gurulink.app');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!code || code.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    
    try {
      const result = await verifyCodeAndCancel(email, code);
      
      if (result.ok) {
        setCancellationData(result.subscription);
        setStep('success');
      } else {
        setError(result.error || 'Failed to cancel subscription. Please try again or contact support.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again or contact support at help@gurulink.app');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    const periodEndDate = cancellationData?.periodEndDate 
      ? new Date(cancellationData.periodEndDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      : 'the end of your current billing cycle';

    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border p-8 space-y-6 text-center" style={{ borderColor: '#E5E7EB' }}>
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1A2336' }}>
              Subscription Cancelled
            </h1>
            <p className="text-sm sm:text-base" style={{ color: '#4B5563' }}>
              Your subscription has been cancelled successfully.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
              <p className="text-sm" style={{ color: '#065F46' }}>
                You will still have access until <strong>{periodEndDate}</strong>. After this date, your subscription will not renew.
              </p>
            </div>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              A confirmation email has been sent to <strong>{email}</strong>.
            </p>
            <div className="pt-4 border-t" style={{ borderColor: '#E5E7EB' }}>
              <button
                onClick={() => navigate(-1)}
                className="inline-block px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105"
                style={{
                  backgroundColor: '#D4A34B',
                  color: '#1A2336',
                  boxShadow: '0 4px 6px -1px rgba(212, 163, 75, 0.3)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border p-8 space-y-6" style={{ borderColor: '#E5E7EB' }}>
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1A2336' }}>
                Verify Your Email
              </h1>
              <p className="text-sm" style={{ color: '#4B5563' }}>
                Enter the 6-digit verification code sent to <strong>{email}</strong>
              </p>
            </div>

            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium mb-2" style={{ color: '#1A2336' }}>
                  Verification Code
                </label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setCode(value);
                  }}
                  placeholder="000000"
                  className="w-full px-4 py-3 rounded-xl border text-center text-2xl font-bold tracking-widest"
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderColor: error ? '#EF4444' : '#E5E7EB',
                    color: '#1A2336',
                    letterSpacing: '0.5em'
                  }}
                  disabled={loading}
                  required
                  maxLength={6}
                />
                {error && (
                  <p className="mt-2 text-sm" style={{ color: '#EF4444' }}>
                    {error}
                  </p>
                )}
                {message && (
                  <p className="mt-2 text-sm" style={{ color: '#10B981' }}>
                    {message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  backgroundColor: (loading || code.length !== 6) ? '#9CA3AF' : '#D4A34B',
                  color: '#1A2336',
                  boxShadow: (loading || code.length !== 6) ? 'none' : '0 4px 6px -1px rgba(212, 163, 75, 0.3)'
                }}
              >
                {loading ? 'Processing...' : 'Cancel Subscription'}
              </button>
            </form>

            <div className="pt-4 border-t text-center" style={{ borderColor: '#E5E7EB' }}>
              <button
                onClick={() => {
                  setStep('email');
                  setCode('');
                  setError('');
                  setMessage('');
                }}
                className="text-xs underline hover:opacity-70 transition-opacity"
                style={{ color: '#D4A34B' }}
              >
                Use a different email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border p-8 space-y-6" style={{ borderColor: '#E5E7EB' }}>
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1A2336' }}>
              Cancel Your Subscription
            </h1>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              Enter the email address associated with your account
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#1A2336' }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border text-sm"
                style={{
                  backgroundColor: '#F8FAFC',
                  borderColor: error ? '#EF4444' : '#E5E7EB',
                  color: '#1A2336'
                }}
                disabled={loading}
                required
              />
              {error && (
                <p className="mt-2 text-sm" style={{ color: '#EF4444' }}>
                  {error}
                </p>
              )}
              {message && (
                <p className="mt-2 text-sm" style={{ color: '#10B981' }}>
                  {message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                backgroundColor: loading ? '#9CA3AF' : '#D4A34B',
                color: '#1A2336',
                boxShadow: loading ? 'none' : '0 4px 6px -1px rgba(212, 163, 75, 0.3)'
              }}
            >
              {loading ? 'Sending...' : 'Continue'}
            </button>
          </form>

          <div className="pt-4 border-t text-center" style={{ borderColor: '#E5E7EB' }}>
            <p className="text-xs mb-2" style={{ color: '#6B7280' }}>
              Need help? Contact us at{' '}
              <a href="mailto:help@gurulink.app" className="underline" style={{ color: '#D4A34B' }}>
                help@gurulink.app
              </a>
            </p>
            <Link 
              to="/cancel-subscription" 
              className="text-xs underline hover:opacity-70 transition-opacity" 
              style={{ color: '#D4A34B' }}
            >
              Back to cancellation information
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
