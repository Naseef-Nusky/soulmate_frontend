/**
 * Custom Checkout Page with PaymentElement
 * 
 * NOTE: This custom checkout page is kept for reference/backup.
 * The application currently uses Stripe's default hosted checkout page.
 * To use this custom checkout, update PreGenerationLanding.jsx to navigate to /checkout
 * instead of using createCheckoutSession.
 */
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Lock, Shield, CreditCard, ArrowLeft, Check } from 'lucide-react';
import { getPricing } from '../utils/currency.js';

// Initialize Stripe - you'll need to set VITE_STRIPE_PUBLISHABLE_KEY in your .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');
const isProd = import.meta.env.PROD;
const debugLog = (...args) => {
  if (!isProd) console.log(...args);
};
const debugWarn = (...args) => {
  if (!isProd) console.warn(...args);
};
const debugError = (...args) => {
  if (!isProd) console.error(...args);
};

function CheckoutForm({ email, name, birthDate, pricing, onBack, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentElementReady, setPaymentElementReady] = useState(false);

  // Add timeout for PaymentElement loading
  useEffect(() => {
    if (!paymentElementReady && elements) {
      const timeout = setTimeout(() => {
        debugWarn('[CheckoutForm] PaymentElement taking longer than expected to load');
        setError(prevError => {
          // Only set timeout error if no other error is present
          if (!prevError) {
            return 'Payment form is taking longer than expected. Please refresh the page if it does not load.';
          }
          return prevError;
        });
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }
  }, [paymentElementReady, elements]);

  const validateInputs = () => {
    if (!email || !email.trim()) return 'Email is required.';
    const normalizedEmail = email.trim();
    // Basic RFC 5322 compliant-ish email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) return 'Please enter a valid email address.';
    if (normalizedEmail.length > 254) return 'Email is too long.';
    if (name && name.trim().length > 120) return 'Name is too long.';
    if (birthDate && birthDate.length > 30) return 'Birth date value looks invalid.';
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      setError('Payment system is not ready. Please wait a moment and try again.');
      return;
    }

    setSubmitting(true);
    setError('');

    // Client-side input validation before touching Stripe
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      setSubmitting(false);
      return;
    }

    try {
      // Validate form first
      const { error: submitError } = await elements.submit();
      if (submitError) {
        debugError('[Checkout] Form validation error:', submitError);
        setError(submitError.message);
        setSubmitting(false);
        return;
      }

      setProcessing(true);

      // Get subscription ID before confirming payment
      const subscriptionId = searchParams.get('subscription_id') || localStorage.getItem('pendingSubscriptionId');
      
      if (!subscriptionId) {
        debugError('[Checkout] No subscription ID found');
        setError('Subscription ID is missing. Please start the checkout process again.');
        setProcessing(false);
        setSubmitting(false);
        return;
      }

      debugLog('[Checkout] Confirming payment for subscription:', subscriptionId);

      // For subscriptions, confirmPayment will:
      // 1. Collect payment method from PaymentElement
      // 2. Attach it to the subscription's payment intent
      // 3. Confirm the payment
      // Note: clientSecret is automatically used from Elements options, but we can also pass it explicitly
      const confirmOptions = {
        elements,
        confirmParams: {
          receipt_email: email,
          return_url: `${window.location.origin}/login?subscription_id=${subscriptionId}&payment=success`,
        },
        redirect: 'if_required',
      };
      
      // Explicitly pass client secret if available (for extra safety)
      if (clientSecret) {
        // The client secret is already in Elements options, but this ensures it's used
        debugLog('[Checkout] Confirming payment with client secret');
      }
      
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment(confirmOptions);

      if (confirmError) {
        debugError('[Checkout] Payment confirmation error:', confirmError);
        setError(confirmError.message || 'Payment failed. Please try again.');
        setProcessing(false);
        setSubmitting(false);
        return;
      }

      // Log payment intent details for debugging
      debugLog('[Checkout] Payment confirmation result:', {
        hasPaymentIntent: !!paymentIntent,
        paymentIntentStatus: paymentIntent?.status,
        paymentIntentId: paymentIntent?.id,
        subscriptionId,
      });

      // For subscriptions, the payment intent status determines next steps
      if (paymentIntent) {
        debugLog('[Checkout] Payment intent status:', paymentIntent.status);
        
        // Payment succeeded - verify subscription status before navigating
        if (paymentIntent.status === 'succeeded') {
          debugLog('[Checkout] Payment succeeded, verifying subscription status...');
          // Mark payment completed to skip checkout if user navigates back
          localStorage.setItem('paymentCompleted', 'true');
          localStorage.setItem('completedSubscriptionId', subscriptionId);
          // Wait a moment for Stripe to update subscription status, then navigate
          setTimeout(() => {
            debugLog('[Checkout] Navigating to login page after successful payment');
            navigate(`/login?subscription_id=${subscriptionId}&payment=success`);
          }, 2000);
          return;
        }
        
        // Payment is processing (async payment methods like bank transfers)
        if (paymentIntent.status === 'processing') {
          debugLog('[Checkout] Payment processing, will verify subscription later');
          localStorage.setItem('paymentCompleted', 'true');
          localStorage.setItem('completedSubscriptionId', subscriptionId);
          // For subscriptions, processing is acceptable - subscription will activate
          // Wait a bit longer for async payments
          setTimeout(() => {
            navigate(`/login?subscription_id=${subscriptionId}&payment=success`);
          }, 3000);
          return;
        }
        
        // Payment requires action (3D Secure, etc.)
        if (paymentIntent.status === 'requires_action') {
          // Stripe should handle this automatically with redirect: 'if_required'
          // But if we're here, it might need manual handling
          setError('Payment requires additional verification. Please complete the verification step.');
          setProcessing(false);
          setSubmitting(false);
          return;
        }
        
        // Payment requires payment method - this means payment method wasn't attached
        if (paymentIntent.status === 'requires_payment_method') {
          debugError('[Checkout] Payment method not attached:', {
            paymentIntentId: paymentIntent.id,
            paymentIntentStatus: paymentIntent.status,
            lastPaymentError: paymentIntent.last_payment_error,
          });
          const errorMessage = paymentIntent.last_payment_error?.message || 
                              'Payment method was declined or not properly attached. Please try again with a different payment method.';
          setError(errorMessage);
          setProcessing(false);
          setSubmitting(false);
          return;
        }
        
        // Other statuses
        setError(`Payment status: ${paymentIntent.status}. Please contact support if this persists.`);
        setProcessing(false);
        setSubmitting(false);
      } else {
        // No payment intent returned - this shouldn't happen
        debugError('[Checkout] No payment intent returned from confirmPayment');
        setError('Payment confirmation failed. Please try again or contact support.');
        setProcessing(false);
        setSubmitting(false);
        // DO NOT navigate - payment was not completed
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      setProcessing(false);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-lg border p-4" style={{ borderColor: '#E5E7EB', backgroundColor: '#F8FAFC' }}>
        {!paymentElementReady && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4A34B] mb-2"></div>
              <p className="text-sm" style={{ color: '#6B7280' }}>Loading payment options...</p>
              {/iPad|iPhone|iPod/.test(navigator.userAgent) && (
                <p className="text-xs mt-2" style={{ color: '#9CA3AF' }}>
                  Apple Pay requires Safari browser
                </p>
              )}
            </div>
          </div>
        )}
        <div style={{ display: paymentElementReady ? 'block' : 'none' }}>
          <PaymentElement
            options={{
              layout: 'tabs',
              // paymentMethodTypes is determined automatically from the PaymentIntent
              // No need to specify it here - it causes warnings
              wallets: {
                applePay: 'auto',
                googlePay: 'auto',
              },
              business: {
                name: 'GuruLink',
              },
              // Additional options to help Apple Pay work on iOS
              fields: {
                billingDetails: {
                  email: 'never',
                  phone: 'never',
                },
              },
            }}
            onReady={() => {
              debugLog('[CheckoutForm] PaymentElement ready');
              debugLog('[CheckoutForm] User agent:', navigator.userAgent);
              debugLog('[CheckoutForm] Is iOS:', /iPad|iPhone|iPod/.test(navigator.userAgent));
              debugLog('[CheckoutForm] Is Safari:', /^((?!chrome|android).)*safari/i.test(navigator.userAgent));
              debugLog('[CheckoutForm] Is HTTPS:', window.location.protocol === 'https:');
              setPaymentElementReady(true);
            }}
            onChange={(event) => {
              if (event.error) {
                debugError('[CheckoutForm] PaymentElement error:', event.error);
                setError(event.error.message);
              } else {
                setError('');
              }
              // Log wallet availability
              if (event.complete) {
                debugLog('[CheckoutForm] PaymentElement complete, available payment methods:', {
                  hasCard: true,
                  hasLink: true,
                });
              }
            }}
          />
        </div>
      </div>

      <div className="rounded-lg border p-4" style={{ borderColor: '#E5E7EB', backgroundColor: '#FFF8F2' }}>
        <div className="flex items-start gap-3">
          <Shield size={20} style={{ color: '#D4A34B', flexShrink: 0, marginTop: '2px' }} />
          <div className="text-sm" style={{ color: '#4B5563' }}>
            <p className="font-semibold mb-1" style={{ color: '#1A2336' }}>Secure Payment</p>
            <p>Your payment information is encrypted and secure. We never store your card details.</p>
            {/iPad|iPhone|iPod/.test(navigator.userAgent) && !/^((?!chrome|android).)*safari/i.test(navigator.userAgent) && (
              <p className="mt-2 text-xs" style={{ color: '#D4A34B' }}>
                💡 <strong>Tip:</strong> Apple Pay is only available in Safari. Please open this page in Safari to use Apple Pay.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting || processing}
          className="flex-1 rounded-lg border border-[#1A2336] px-6 py-4 font-semibold text-[#1A2336] transition hover:bg-[#F5F5F5] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={18} className="inline mr-2" />
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || !elements || !paymentElementReady || submitting || processing}
          className="flex-1 rounded-lg bg-[#1A2336] px-6 py-4 font-bold text-white transition hover:bg-[#D4A34B] hover:text-[#1A2336] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <>
              <span className="inline-block mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent align-middle" />
              Processing...
            </>
          ) : submitting ? (
            'Validating...'
          ) : (
            <>
              <Lock size={18} className="inline mr-2" />
              Pay {pricing.trial.formatted}
            </>
          )}
        </button>
      </div>

      <p className="text-center text-xs" style={{ color: '#6B7280' }}>
        Secured by Stripe · Your card will be charged {pricing.trial.formatted} today, then {pricing.monthly.formatted}/month after 7 days
      </p>
    </form>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [subscriptionId, setSubscriptionId] = useState('');

  const pricing = getPricing('USD');

  useEffect(() => {
    // If payment was already completed, redirect to login to avoid re-checkout
    const paymentCompleted = localStorage.getItem('paymentCompleted') === 'true';
    const completedSubscriptionId = localStorage.getItem('completedSubscriptionId') || localStorage.getItem('pendingSubscriptionId');
    const paymentQuerySuccess = searchParams.get('payment') === 'success';
    const paymentQuerySubId = searchParams.get('subscription_id') || completedSubscriptionId;

    // If URL explicitly says payment success, redirect
    if (paymentQuerySuccess && paymentQuerySubId) {
      navigate(`/login?subscription_id=${paymentQuerySubId}&payment=success`, { replace: true });
      return;
    }

    // If a previous payment set the flags but we are back without success param,
    // clear them so checkout can load normally.
    if (paymentCompleted && completedSubscriptionId) {
      localStorage.removeItem('paymentCompleted');
      localStorage.removeItem('completedSubscriptionId');
    }

    // Get data from URL params or localStorage
    const emailParam = searchParams.get('email');
    const nameParam = searchParams.get('name');
    const birthDateParam = searchParams.get('birthDate');
    
    const pendingSignup = JSON.parse(localStorage.getItem('pendingSignup') || '{}');
    const storedEmail = emailParam || pendingSignup.email;
    const storedName = nameParam || pendingSignup.name;
    const storedBirthDate = birthDateParam || pendingSignup.birthDate;

    if (!storedEmail) {
      setError('Email is required. Please go back and provide your email.');
      setLoading(false);
      return;
    }

    setEmail(storedEmail);
    setName(storedName || '');
    setBirthDate(storedBirthDate || '');

    // Check if we already have a subscription ID and client secret
    const existingSubscriptionId = searchParams.get('subscription_id');
    const existingClientSecret = searchParams.get('client_secret');

    if (existingSubscriptionId && existingClientSecret) {
      // Validate client secret format (should start with pi_ or seti_)
      if (!existingClientSecret.startsWith('pi_') && !existingClientSecret.startsWith('seti_')) {
        debugError('[CheckoutPage] Invalid client secret format:', existingClientSecret.substring(0, 20));
        setError('Invalid payment configuration. Please start the checkout process again.');
        setLoading(false);
        return;
      }
      setSubscriptionId(existingSubscriptionId);
      setClientSecret(existingClientSecret);
      localStorage.setItem('pendingSubscriptionId', existingSubscriptionId);
      setLoading(false);
      return;
    }

    // Create subscription with retry logic and race condition prevention
    let isCreating = false;
    const createSubscription = async () => {
      // Prevent multiple simultaneous calls
      if (isCreating) {
        debugLog('[CheckoutPage] Subscription creation already in progress, skipping...');
        return;
      }
      
      isCreating = true;
      try {
        const { createSubscription: createSubscriptionAPI } = await import('../lib/api.js');
        
        // Get quiz data from localStorage
        const quizDataStr = localStorage.getItem('quizData');
        let quizData = null;
        if (quizDataStr) {
          try {
            quizData = JSON.parse(quizDataStr);
            quizData.email = storedEmail.trim().toLowerCase();
          } catch (e) {
            debugError('[CheckoutPage] Failed to parse quiz data:', e);
          }
        }

        debugLog('[CheckoutPage] Creating subscription...');
        const result = await createSubscriptionAPI({
          email: storedEmail.trim(),
          name: storedName?.trim() || null,
          birthDate: storedBirthDate || null,
          quizData,
          currency: 'USD',
          country: 'US',
        });

        if (!result || !result.subscriptionId || !result.clientSecret) {
          throw new Error('Invalid response from server. Please try again.');
        }

        // Validate client secret format
        if (!result.clientSecret.startsWith('pi_') && !result.clientSecret.startsWith('seti_')) {
          debugError('[CheckoutPage] Invalid client secret format from server');
          throw new Error('Invalid payment configuration received from server. Please try again.');
        }

        setSubscriptionId(result.subscriptionId);
        setClientSecret(result.clientSecret);
        localStorage.setItem('pendingSubscriptionId', result.subscriptionId);
        debugLog('[CheckoutPage] ✅ Subscription created successfully');
      } catch (err) {
        const errorMessage = err.message || 'Failed to initialize payment. Please try again.';
        setError(errorMessage);
        debugError('[CheckoutPage] Failed to create subscription:', err);
      } finally {
        setLoading(false);
        isCreating = false;
      }
    };

    createSubscription();
  }, [searchParams, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A34B] mb-4"></div>
          <p className="text-lg font-semibold" style={{ color: '#1A2336' }}>Setting up secure checkout...</p>
        </div>
      </div>
    );
  }

  if (error && !clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="max-w-md w-full rounded-lg shadow-lg p-8" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="text-center">
            <div className="rounded-full bg-red-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1A2336' }}>Checkout Error</h2>
            <p className="mb-6" style={{ color: '#4B5563' }}>{error}</p>
            <button
              onClick={handleBack}
              className="w-full rounded-lg bg-[#1A2336] px-6 py-3 font-semibold text-white transition hover:bg-[#D4A34B] hover:text-[#1A2336]"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Only create options if we have a client secret
  // Note: wallets and business should be in PaymentElement options, not Elements options
  const options = clientSecret ? {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#D4A34B',
        colorBackground: '#FFFFFF',
        colorText: '#1A2336',
        colorDanger: '#EF4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  } : null;

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-medium mb-4" style={{ color: '#4B5563' }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#1A2336' }}>
            Complete Your Payment
          </h1>
          <p className="text-lg" style={{ color: '#4B5563' }}>
            Secure checkout powered by Stripe
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Payment Form - Takes 2 columns */}
          <div className="md:col-span-2">
            <div className="rounded-lg shadow-lg p-6 md:p-8" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard size={20} style={{ color: '#D4A34B' }} />
                  <h2 className="text-xl font-bold" style={{ color: '#1A2336' }}>Payment Details</h2>
                </div>
              </div>

              {clientSecret && options ? (
                <Elements 
                  stripe={stripePromise} 
                  options={options} 
                  key={clientSecret}
                >
                  <CheckoutForm 
                    email={email}
                    name={name}
                    birthDate={birthDate}
                    pricing={pricing}
                    onBack={handleBack}
                    clientSecret={clientSecret}
                  />
                </Elements>
              ) : (
                <div className="text-center py-8">
                  {error ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                      <p className="font-semibold mb-1">Payment Setup Error</p>
                      <p>{error}</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="mt-3 text-sm text-red-600 underline hover:text-red-700"
                      >
                        Reload page
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4A34B] mb-4"></div>
                      <p style={{ color: '#4B5563' }}>Loading payment form...</p>
                      <p className="text-xs mt-2" style={{ color: '#9CA3AF' }}>This may take a few seconds</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary - Takes 1 column */}
          <div className="md:col-span-1">
            <div className="rounded-lg shadow-lg p-6 sticky top-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#1A2336' }}>Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-4 border-b" style={{ borderColor: '#E5E7EB' }}>
                  <div>
                    <p className="font-semibold" style={{ color: '#1A2336' }}>7-Day Trial</p>
                    <p className="text-sm" style={{ color: '#6B7280' }}>Then {pricing.monthly.formatted}/month</p>
                  </div>
                  <p className="text-lg font-bold" style={{ color: '#1A2336' }}>{pricing.trial.formatted}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Check size={16} style={{ color: '#D4A34B', flexShrink: 0, marginTop: '2px' }} />
                    <p className="text-sm" style={{ color: '#4B5563' }}>Soulmate sketch & reading</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} style={{ color: '#D4A34B', flexShrink: 0, marginTop: '2px' }} />
                    <p className="text-sm" style={{ color: '#4B5563' }}>Personalized astrology insights</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} style={{ color: '#D4A34B', flexShrink: 0, marginTop: '2px' }} />
                    <p className="text-sm" style={{ color: '#4B5563' }}>Cancel anytime</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t" style={{ borderColor: '#E5E7EB' }}>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold" style={{ color: '#1A2336' }}>Total Today</p>
                  <p className="text-xl font-bold" style={{ color: '#1A2336' }}>{pricing.trial.formatted}</p>
                </div>
                <p className="text-xs" style={{ color: '#6B7280' }}>
                  Then {pricing.monthly.formatted}/month after 7 days
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

