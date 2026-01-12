import { useState, useRef, useEffect } from 'react';
import { Star, Check, Lock, ChevronDown } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { detectCurrency, getPricing, getCurrencyInfo, setCurrency } from '../utils/currency.js';
import { createCheckoutSession, checkAccountExists } from '../lib/api.js';
import Footer from './Footer';
import { trackPurchaseStart } from '../utils/ga.js';

export default function PreGenerationLanding({ onSubmit, email, name, birthDate, formData, loading = false }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Check if payment was successful
  const sessionId = searchParams.get('session_id');
  const paymentSuccess = searchParams.get('payment');
  const isPaymentSuccess = sessionId && paymentSuccess === 'success';
  const faqs = [
    {
      q: 'How long will it take to receive my sketch and reading?',
      a: 'Your personalized sketch and reading from GuruLink will be delivered within 24 hours. Our artists take this time to carefully analyze your details and craft a precise, meaningful portrait and interpretation. We appreciate your patience while we create something truly special for you!',
    },
    {
      q: 'What’s included in my GuruLink sketch?',
      a: 'Each GuruLink sketch features a beautifully detailed portrait of your soulmate, drawn based on the answers you provide. Along with your portrait, you’ll also receive a personalized astrological love report that reveals the deeper meaning of your spiritual and emotional connection.',
    },
    {
      q: 'Will I actually recognize my soulmate from the portrait?',
      a: 'Many GuruLink users have shared amazing experiences of meeting someone who looks remarkably similar to their sketch. While every portrait is based on your most compatible traits and energy, it serves as both guidance and inspiration to help you connect with your destined partner.',
    },
    {
      q: 'What can I expect from the GuruLink service?',
      a: 'GuruLink offers a unique, personalized experience — you’ll receive a hand-drawn portrait of your soulmate crafted using your information and our AI-assisted astrology insights. Along with your sketch, you’ll get an in-depth relationship guide that helps you understand the cosmic bond and the energy behind your connection.',
    },
    {
      q: 'How can I cancel my GuruLink subscription?',
      a: 'Canceling your subscription is easy and only takes a few minutes. Simply visit the GuruLink Help Center and follow the step-by-step instructions. You’ll continue to have full access until the end of your current billing period.',
    },
  ];
  

	const [openFaq, setOpenFaq] = useState(null);
	const [currency] = useState('GBP');
  const [countryCode] = useState('GB');
	const pricing = getPricing('GBP');
  const paymentSectionRef = useRef(null);
  const [paymentError, setPaymentError] = useState('');
  const [processingCheckout, setProcessingCheckout] = useState(false);

  const handleScrollToPayment = () => {
    if (paymentSectionRef.current) {
      paymentSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleStartCheckout = async () => {
    // Prevent multiple clicks
    if (processingCheckout) {
      console.log('[PreGenerationLanding] Checkout already in progress, ignoring click');
      return;
    }

    if (!email || !email.trim()) {
      setPaymentError('Please provide your email to continue.');
      return;
    }

    setProcessingCheckout(true);
    setPaymentError('');

    try {
      // Check if account already exists before proceeding with payment
      const cleanedEmail = email.trim().toLowerCase();
      
      let accountCheck;
      try {
        accountCheck = await checkAccountExists(cleanedEmail);
        console.log('[PreGenerationLanding] Account check result:', {
          exists: accountCheck?.exists,
          email: cleanedEmail,
        });
      } catch (accountCheckError) {
        console.error('[PreGenerationLanding] Account check failed:', accountCheckError);
        // Continue with checkout even if account check fails - backend will handle it
        accountCheck = { exists: false };
      }
      
      if (accountCheck?.exists) {
        setPaymentError('An account with this email already exists. Please log in instead.');
        setProcessingCheckout(false);
        return;
      }
      // Get quiz data from localStorage (saved when quiz was completed)
      // Wrap in try-catch for Safari private mode compatibility
      let quizDataStr = null;
      try {
        quizDataStr = localStorage.getItem('quizData');
      } catch (storageError) {
        console.warn('[PreGenerationLanding] localStorage not available (Safari private mode?):', storageError);
        // Continue - we'll reconstruct from formData
      }
      
      let quizData = null;
      
      if (quizDataStr) {
        try {
          quizData = JSON.parse(quizDataStr);
          console.log('[PreGenerationLanding] ✅ Quiz data found in localStorage:', {
            hasAnswers: !!quizData.answers,
            hasBirthDetails: !!quizData.birthDetails,
            email: quizData.email,
            answerKeys: quizData.answers ? Object.keys(quizData.answers) : [],
            answerCount: quizData.answers ? Object.keys(quizData.answers).length : 0,
          });
          
          // Update email in quiz data to match payment email
          quizData.email = email.trim().toLowerCase();
        } catch (e) {
          console.error('[PreGenerationLanding] Failed to parse quiz data from localStorage:', e);
        }
      }
      
      // If no quiz data in localStorage, reconstruct it from formData
      if (!quizData && formData) {
        console.log('[PreGenerationLanding] ⚠️ No quiz data in localStorage, reconstructing from formData...');
        console.log('[PreGenerationLanding] FormData keys:', Object.keys(formData));
        
        // Reconstruct quiz data from form state
        quizData = {
          answers: { ...formData },
          birthDetails: {
            date: formData.birthDate || null,
            time: formData.birthTime || null,
            city: formData.birthCity || null,
          },
          email: email.trim().toLowerCase(),
          timestamp: new Date().toISOString(),
        };
        
        console.log('[PreGenerationLanding] ✅ Quiz data reconstructed from formData:', {
          hasAnswers: !!quizData.answers,
          hasBirthDetails: !!quizData.birthDetails,
          answerKeys: Object.keys(quizData.answers),
          answerCount: Object.keys(quizData.answers).length,
        });
        
        // Also save to localStorage for future use
        try {
          localStorage.setItem('quizData', JSON.stringify(quizData));
          console.log('[PreGenerationLanding] ✅ Reconstructed quiz data saved to localStorage');
        } catch (e) {
          console.warn('[PreGenerationLanding] Failed to save reconstructed quiz data to localStorage:', e);
        }
      }
      
      if (!quizData || !quizData.answers || Object.keys(quizData.answers).length === 0) {
        console.error('[PreGenerationLanding] ❌ No quiz data available! Cannot proceed with payment.', {
          hasQuizData: !!quizData,
          hasAnswers: !!quizData?.answers,
          answerCount: quizData?.answers ? Object.keys(quizData.answers).length : 0,
          formDataKeys: formData ? Object.keys(formData) : [],
          localStorageAvailable: typeof localStorage !== 'undefined',
        });
        setPaymentError('Quiz data is required. Please complete the quiz first. If you already completed it, please refresh the page and try again.');
        setProcessingCheckout(false);
        return;
      }

      // Store email and user data in localStorage for after payment
      // Wrap in try-catch for Safari private mode compatibility
      try {
        localStorage.setItem('pendingSignup', JSON.stringify({
          email: email.trim(),
          name: name?.trim() || null,
          birthDate,
        }));
      } catch (storageError) {
        // Safari private mode or storage disabled - log but continue
        console.warn('[PreGenerationLanding] localStorage not available:', storageError);
        // Continue anyway - data will be passed via URL params
      }

      // Use Stripe's default checkout page (hosted checkout)
      const appUrl = window.location.origin;
      
      // Ensure we're using HTTPS for Stripe redirects
      const isSecure = window.location.protocol === 'https:' || 
                       window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1';
      
      if (!isSecure && window.location.protocol === 'http:') {
        console.warn('[PreGenerationLanding] Not using HTTPS - Stripe may require HTTPS');
      }
      
      console.log('[PreGenerationLanding] Creating checkout session...', {
        email: email.trim(),
        hasQuizData: !!quizData,
        quizDataKeys: quizData ? Object.keys(quizData) : [],
        hasAnswers: !!quizData?.answers,
        answerCount: quizData?.answers ? Object.keys(quizData.answers).length : 0,
        timestamp: new Date().toISOString(),
      });

      // Track purchase start
      trackPurchaseStart();

      let result;
      try {
        result = await createCheckoutSession({
          email: email.trim(),
          name: name?.trim() || null,
          birthDate: birthDate || null,
          quizData,
          currency: 'GBP',
          country: 'GB',
        });
      } catch (checkoutError) {
        console.error('[PreGenerationLanding] Checkout session creation error:', {
          error: checkoutError.message,
          errorName: checkoutError.name,
          errorStack: checkoutError.stack,
          timestamp: new Date().toISOString(),
        });
        throw checkoutError;
      }

      console.log('[PreGenerationLanding] Checkout session response:', {
        hasResult: !!result,
        hasUrl: !!result?.url,
        urlLength: result?.url?.length,
        sessionId: result?.sessionId,
        urlPreview: result?.url ? result.url.substring(0, 80) + '...' : null,
        timestamp: new Date().toISOString(),
      });

      if (!result) {
        throw new Error('No response from server. Please try again.');
      }

      if (!result.url) {
        console.error('[PreGenerationLanding] Missing checkout URL in response:', result);
        throw new Error('Failed to get checkout URL. Please try again.');
      }

      // Validate URL before redirecting
      if (!result.url.startsWith('https://')) {
        console.error('[PreGenerationLanding] Invalid checkout URL (not HTTPS):', result.url);
        throw new Error('Invalid checkout URL. Please contact support.');
      }

      // Log redirect attempt
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      console.log('[PreGenerationLanding] Redirecting to Stripe checkout...', {
        url: result.url.substring(0, 100) + '...',
        isMobile,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });

      // Set a flag to show we're redirecting (prevents showing error if redirect is slow)
      setProcessingCheckout(true);
      
      // Store the URL in case redirect fails - we can show a manual link
      try {
        localStorage.setItem('pendingCheckoutUrl', result.url);
      } catch (e) {
        // Ignore localStorage errors
      }
      
      // Small delay to ensure state updates before redirect
      await new Promise(resolve => setTimeout(resolve, 100));

      // For mobile devices, use a more reliable redirect method
      if (isMobile) {
        // On mobile, try multiple redirect methods for better compatibility
        let redirectSuccess = false;
        
        try {
          // Method 1: Standard redirect (works in most cases)
          console.log('[PreGenerationLanding] Attempting redirect method 1: window.location.href');
          window.location.href = result.url;
          redirectSuccess = true;
          
          // If we're still here after 3 seconds, redirect might have failed
          setTimeout(() => {
            if (document.visibilityState === 'visible') {
              console.warn('[PreGenerationLanding] Redirect may have failed, trying alternative...');
              try {
                window.location.replace(result.url);
              } catch (e) {
                console.error('[PreGenerationLanding] Alternative redirect also failed:', e);
                // Show manual link option
                setPaymentError(`Redirect failed. Please click this link to continue: ${result.url.substring(0, 50)}...`);
                setProcessingCheckout(false);
              }
            }
          }, 3000);
        } catch (redirectError) {
          console.error('[PreGenerationLanding] Redirect failed, trying alternative method:', redirectError);
          // Method 2: Use replace (doesn't add to history)
          try {
            window.location.replace(result.url);
            redirectSuccess = true;
          } catch (replaceError) {
            console.error('[PreGenerationLanding] Replace also failed, trying window.open:', replaceError);
            // Method 3: Open in same window (last resort)
            try {
              const opened = window.open(result.url, '_self');
              if (!opened) {
                throw new Error('Browser blocked redirect');
              }
              redirectSuccess = true;
            } catch (openError) {
              console.error('[PreGenerationLanding] All redirect methods failed:', openError);
              // Show manual link as fallback
              setPaymentError(`Unable to redirect automatically. Please click this link to continue: ${result.url}`);
              setProcessingCheckout(false);
            }
          }
        }
      } else {
        // For desktop, use standard redirect
        console.log('[PreGenerationLanding] Desktop redirect: window.location.href');
        try {
          window.location.href = result.url;
        } catch (redirectError) {
          console.error('[PreGenerationLanding] Desktop redirect failed:', redirectError);
          setPaymentError(`Unable to redirect automatically. Please click this link to continue: ${result.url}`);
          setProcessingCheckout(false);
        }
      }
    } catch (err) {
      // Provide more helpful error messages for mobile users
      let errorMessage = err.message || 'Unable to start checkout. Please try again.';
      
      // Detect common mobile-specific issues
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      // Log comprehensive error details
      console.error('[PreGenerationLanding] Checkout error details:', {
        error: err,
        errorName: err.name,
        errorMessage: err.message,
        errorStack: err.stack,
        errorToString: err.toString(),
        isMobile,
        isSafari,
        userAgent: navigator.userAgent,
        location: window.location.href,
        timestamp: new Date().toISOString(),
      });
      
      if (isMobile) {
        if (err.message?.includes('timeout') || err.message?.includes('Connection timeout')) {
          errorMessage = 'Connection timeout. Please check your internet connection and try again. If the problem persists, try using Wi-Fi instead of mobile data.';
        } else if (err.message?.includes('Network error') || err.message?.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check your internet connection. If you\'re using mobile data, try switching to Wi-Fi.';
        } else if (err.message?.includes('CORS') || err.message?.includes('blocked')) {
          errorMessage = 'Connection blocked by browser. Please try disabling ad blockers or privacy extensions and try again.';
        } else if (isSafari && err.message?.includes('localStorage')) {
          errorMessage = 'Safari private mode detected. Please use regular browsing mode to complete checkout.';
        } else if (err.message?.includes('Invalid response') || err.message?.includes('No response')) {
          errorMessage = 'Server did not respond. Please check your internet connection and try again.';
        } else if (err.message?.includes('Invalid checkout URL') || err.message?.includes('Failed to get checkout URL')) {
          errorMessage = 'Failed to create checkout session. Please try again or contact support if the problem persists.';
        }
      }
      
      setPaymentError(errorMessage);
      setProcessingCheckout(false);
    }
  };

  const handleGetSketchNow = () => {
    // Redirect to login page with payment success params
    navigate(`/login?session_id=${sessionId}&payment=success`);
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32">
        {/* Hero Section */}
        <div className="rounded-lg shadow-lg p-8 mb-8 border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center" style={{ color: '#1A2336' }}>
            Get Full Access to GuruLink – Start Today
          </h1>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-6">
            <div className="flex-1 text-center md:text-left">
              <div className="mb-4" style={{ color: '#4B5563' }}>
                Unlock your life path with a detailed soulmate sketch and personalized compatibility reading.
              </div>
              <div className="flex items-center justify-center md:justify-start gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} style={{ fill: '#D4A34B', color: '#D4A34B' }} />
                ))}
                <span className="text-sm font-semibold" style={{ color: '#4B5563' }}>5-Star Rated Experience</span>
              </div>
              <button 
                onClick={handleScrollToPayment}
                className="font-bold py-4 px-8 rounded-lg text-lg transition"
                style={{ backgroundColor: '#D4A34B', color: '#1A2336' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c4933a')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D4A34B')}
              >
                {loading ? 'Please wait...' : 'Get My Soulmate Sketch'}
              </button>
            </div>
            <div className="flex-1 max-w-md">
              <div className="rounded-lg p-4 text-center border" style={{ backgroundColor: '#F8FAFC', borderColor: '#E5E7EB' }}>
                <div className="text-sm mb-2" style={{ color: '#D4A34B' }}>Visualization of your soulmate sketch</div>
                <img
                  src="/soulmatePortrait.png"
                  alt="Visualization of your soulmate sketch"
                  className="w-full h-64 object-cover rounded"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Benefits & Pricing Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Left: Benefits */}
          <div className="rounded-lg shadow p-6 border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>

            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1A2336' }}>WHY GURULINK'S SOULMATE SKETCH STANDS OUT</h2>

            <div className="space-y-5">
              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#1A2336' }}>Expertly Crafted Artwork</h3>
                <p className="text-sm" style={{ color: '#4B5563' }}>
                  Receive a unique hand-drawn sketch created by talented artists, highlighting the personality traits that make your soulmate connection special.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#1A2336' }}>Astrology-Based Insights</h3>
                <p className="text-sm" style={{ color: '#4B5563' }}>
                  Each sketch includes a personalized astrological compatibility analysis, offering deeper understanding of your connection through your birth charts.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#1A2336' }}>Tailored Personality Profile</h3>
                <p className="text-sm" style={{ color: '#4B5563' }}>
                  Discover a detailed description of your soulmate’s character, traits, and the emotional bond you’re likely to share.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Pricing */}
          <div ref={paymentSectionRef} className="rounded-lg shadow-lg p-6 border space-y-5" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
            <div className="rounded-lg border p-4 space-y-2" style={{ borderColor: '#E5E7EB', backgroundColor: '#FFF8F2' }}>
              <p className="text-sm font-semibold" style={{ color: '#1A2336' }}>Experience Your GuruLink — 7-Day Preview</p>
              <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
                <li>Get an exclusive artist-illustrated portrait inspired by your destined connection</li>
                <li>Uncover key personality qualities and emotional traits of your match</li>
                <li>Receive custom insights guided by astrological patterns and spiritual signals</li>
                <li>Enjoy a 7-day introductory offer for just £0.99. After the trial, membership renews at £14.99/month</li>
              </ul>
            </div>

            <div className="mt-4">
              {paymentError && !isPaymentSuccess && (
                <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {paymentError.includes('https://') ? (
                    <div>
                      <p className="mb-2">{paymentError.split('https://')[0]}</p>
                      <a 
                        href={`https://${paymentError.split('https://')[1]}`}
                        target="_self"
                        className="text-blue-600 underline break-all font-semibold"
                        onClick={() => setProcessingCheckout(false)}
                      >
                        Click here to continue to checkout
                      </a>
                    </div>
                  ) : (
                    paymentError
                  )}
                </div>
              )}
              
              {isPaymentSuccess && (
                <div className="mb-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                  ✅ Payment successful! Click below to access your sketch.
                </div>
              )}
              
              <div className="space-y-4">
                {isPaymentSuccess ? (
                  <>
                    <div className="text-center">
                      <p className="text-sm mb-2 font-semibold" style={{ color: '#1A2336' }}>
                        Your payment was successful!
                      </p>
                      <p className="text-xs mb-4" style={{ color: '#666' }}>
                        Click the button below to access your account and view your sketch.
                      </p>
                    </div>
                    
                    <button
                      onClick={handleGetSketchNow}
                      disabled={loading}
                      className="w-full rounded-lg bg-[#D4A34B] px-6 py-4 font-bold text-[#1A2336] transition hover:bg-[#c4933a] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Loading...' : 'Get Your Sketch Now'}
                    </button>
                  </>
                ) : (
                  <>
                    {/* Promo Code Notification */}
                    <div
                      className="mb-4 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3 text-center sm:text-left"
                      style={{ backgroundColor: '#E9D5FF' }}
                    >
                      <div
                        className="w-10 h-10 flex-shrink-0 mx-auto sm:mx-0 flex items-center justify-center rounded-full"
                        style={{ color: '#7C3AED', backgroundColor: 'rgba(124, 58, 237, 0.1)' }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="8" width="18" height="12" rx="2"/>
                          <path d="M12 8V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2"/>
                          <path d="M12 8h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4"/>
                          <path d="M12 8v12"/>
                        </svg>
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-tight" style={{ color: '#4B5563' }}>
                          Promo Code <span className="font-normal sm:font-semibold">SOULMATEGURULINK93</span> Applied
                        </p>
                        <p className="text-xs" style={{ color: '#6B7280' }}>
                          You save 93%
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleStartCheckout}
                      disabled={processingCheckout || loading}
                      className="w-full rounded-lg bg-[#1A2336] px-6 py-4 font-bold text-white transition hover:bg-[#D4A34B] hover:text-[#1A2336] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingCheckout ? (
                        <>
                          <span className="inline-block mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent align-middle" />
                          Redirecting to checkout...
                        </>
                      ) : (
                        `Pay ${pricing.trial.formatted}`
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* User Portraits */}
        <div className="rounded-lg shadow p-6 mb-8 border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#1A2336' }}>Our Users' Soulmate Portraits</h2>
          <div className="rounded-lg overflow-hidden border" style={{ borderColor: '#E5E7EB' }}>
            <img
              src="/soulmatePortrait2.png"
              alt="Examples of our users' soulmate portraits"
              className="w-full h-auto rounded-lg"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* Testimonials */}
        <div className="rounded-lg shadow p-6 mb-8 border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#1A2336' }}>Why does everyone love GuruLink?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah M.', date: '2 weeks ago', text: 'I was skeptical at first, but when I met someone matching the sketch, I was amazed!' },
              { name: 'James K.', date: '1 month ago', text: 'The accuracy was incredible. My sketch helped me recognize my partner instantly.' },
              { name: 'Emma L.', date: '3 weeks ago', text: 'Best investment I\'ve made. The detailed insights were spot-on.' },
            ].map((testimonial, i) => (
              <div key={i} className="rounded-lg p-4 border" style={{ backgroundColor: '#F8FAFC', borderColor: '#E5E7EB' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#D4A34B', color: '#1A2336' }}>
                    {testimonial.name.split(' ').map((part) => part[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: '#1A2336' }}>{testimonial.name}</div>
                    <div className="text-xs" style={{ color: '#666' }}>{testimonial.date}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} style={{ fill: '#D4A34B', color: '#D4A34B' }} />
                  ))}
                </div>
                <p className="text-sm" style={{ color: '#4B5563' }}>&quot;{testimonial.text}&quot;</p>
              </div>
            ))}
          </div>
        </div>

		{/* FAQ Section */}
		<div className="rounded-lg shadow p-6 mb-8 border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
			<h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#1A2336' }}>Frequently Asked Questions</h2>
			<div className="border rounded-lg" style={{ borderColor: '#E5E7EB' }}>
				{faqs.map((item, i) => {
					const open = openFaq === i;
					return (
						<div key={i} className={i > 0 ? 'border-t' : ''} style={{ borderColor: '#E5E7EB' }}>
							<button
								onClick={() => setOpenFaq(open ? null : i)}
								className="w-full flex items-center justify-between p-4 text-left transition-colors"
								style={{ 
									color: '#1A2336',
									backgroundColor: open ? '#FFF7EB' : 'transparent'
								}}
								onMouseEnter={(e) => !open && (e.currentTarget.style.backgroundColor = '#F8FAFC')}
								onMouseLeave={(e) => !open && (e.currentTarget.style.backgroundColor = 'transparent')}
								aria-expanded={open}
								aria-controls={`faq-${i}`}
							>
								<span className="font-semibold">{item.q}</span>
								<ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: '#D4A34B' }} />
							</button>
							<div id={`faq-${i}`} className={`px-4 pb-4 ${open ? 'block' : 'hidden'}`} style={{ color: '#4B5563' }}>
								{item.a}
							</div>
						</div>
					);
				})}
			</div>
		</div>

        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 py-4 px-6 shadow-lg z-50 border-t" style={{ backgroundColor: '#1A2336', borderColor: 'rgba(212, 163, 75, 0.3)', color: '#F5F5F5' }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <div className="font-bold">
                {isPaymentSuccess ? 'Payment Successful!' : 'Your Soulmate Sketch Awaits'}
              </div>
              <div className="text-sm opacity-90">
                {isPaymentSuccess ? 'Click below to access your sketch' : 'Join 750+ users who found their match'}
              </div>
            </div>
            <button 
              onClick={isPaymentSuccess ? handleGetSketchNow : handleScrollToPayment}
              className="font-bold py-3 px-8 rounded-lg transition"
              style={{ backgroundColor: '#D4A34B', color: '#1A2336' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c4933a')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D4A34B')}
            >
              {loading ? 'Please wait...' : (isPaymentSuccess ? 'Get Your Sketch Now' : 'Get My Soulmate Sketch')}
            </button>
          </div>
        </div>

        {/* Spacer for fixed bottom button */}
        <div className="h-28" />
      </div>

      <Footer />
      <div className="pb-12" />
    </>
  );
}

