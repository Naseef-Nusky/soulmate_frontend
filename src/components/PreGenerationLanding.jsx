import { useState, useRef, useEffect } from 'react';
import { Star, Check, Lock, ChevronDown } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { detectCurrency, getPricing } from '../utils/currency.js';
import { createPaymentIntent } from '../lib/api.js';
import PaymentDialog from './PaymentDialog.jsx';
import Footer from './Footer';

const stripePublishableKey = import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

export default function PreGenerationLanding({ onSubmit, email, name, birthDate, loading = false }) {
  // Payment integration can be added here before calling onSubmit
  // For example: handlePayment().then(() => onSubmit())
  const faqs = [
    {
      q: 'How long will it take to receive my sketch and reading?',
      a: 'Your personalized sketch and reading from GuruLink will be delivered within 24 hours. Our artists and astrologers take this time to carefully analyze your details and craft a precise, meaningful portrait and interpretation. We appreciate your patience while we create something truly special for you!',
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
	const [currency] = useState(() => detectCurrency());
	const pricing = getPricing(currency);
  const paymentSectionRef = useRef(null);
  const [paymentState, setPaymentState] = useState(null);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [creatingIntent, setCreatingIntent] = useState(false);

  useEffect(() => {
    if (!stripePromise) {
      setPaymentError('Stripe is not configured. Please contact support.');
    }
  }, []);

  useEffect(() => {
    if (!email || !email.trim()) {
      setPaymentError('Please provide your email to continue.');
      return;
    }
    if (paymentSuccess || !stripePromise) return;
    let isMounted = true;
    setCreatingIntent(true);
    setPaymentError('');
    (async () => {
      try {
        const paymentInit = await createPaymentIntent({
          email: email.trim(),
          name: name?.trim() || null,
          birthDate,
          currency,
        });
        if (!isMounted) return;
        setPaymentState({
          clientSecret: paymentInit.clientSecret,
          paymentIntentId: paymentInit.paymentIntentId,
          amountLabel: paymentInit.displayAmount || pricing.trial.formatted,
          currencyLabel: paymentInit.currency || currency,
        });
      } catch (err) {
        if (isMounted) {
          setPaymentError(err.message || 'Unable to start secure payment. Please try again.');
        }
      } finally {
        if (isMounted) setCreatingIntent(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [email, name, birthDate, currency, pricing.trial.formatted, paymentSuccess]);

  const handleScrollToPayment = () => {
    if (paymentSectionRef.current) {
      paymentSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePaymentCompletion = async (_paymentIntentId) => {
    setPaymentSuccess(true);
    setPaymentState(null);
    try {
      await onSubmit();
    } catch (err) {
      setPaymentError(err.message || 'Payment succeeded but we could not continue. Please contact support.');
    }
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32">
        {/* Hero Section */}
        <div className="rounded-lg shadow-lg p-8 mb-8 border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center" style={{ color: '#1A2336' }}>
            Get Full Access to GuruLink – Start Your 7-Day Trial
          </h1>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-6">
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm uppercase tracking-wide mb-2" style={{ color: '#D4A34B' }}>
                Secure Stripe Checkout · 564,000+ Happy Members
              </p>
              <div className="mb-4" style={{ color: '#4B5563' }}>
                Unlock your life path with a detailed soulmate sketch, compatibility reading, and unlimited 1-on-1 chats with real astrologers.
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
              <p className="text-sm font-semibold" style={{ color: '#1A2336' }}>What you’ll receive today</p>
              <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
                <li>Beautifully crafted soulmate sketch, drawn by real artists.</li>
                <li>Unique personality traits & compatibility notes tailored to you.</li>
                <li>Personalized astrological and spiritual insights made just for you.</li>
              </ul>
            </div>

            <div className="mt-4">
              {paymentError && (
                <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {paymentError}
                </div>
              )}
              {creatingIntent && (
                <div className="text-sm text-center text-[#4B5563]">Loading secure checkout…</div>
              )}
              {paymentSuccess && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                  Payment received! We’re preparing your personalized sketch.
                </div>
              )}
              {paymentState?.clientSecret && stripePromise && !paymentSuccess && (
                <Elements stripe={stripePromise} options={{ clientSecret: paymentState.clientSecret }}>
                  <PaymentDialog
                    inline
                    amountLabel={paymentState.amountLabel}
                    currencyLabel={paymentState.currencyLabel}
                    email={email}
                    onSuccess={handlePaymentCompletion}
                  />
                </Elements>
              )}
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
              <div className="font-bold">Your Soulmate Sketch Awaits</div>
              <div className="text-sm opacity-90">Join 1+ million users who found their match</div>
            </div>
            <button 
              onClick={handleScrollToPayment}
              className="font-bold py-3 px-8 rounded-lg transition"
              style={{ backgroundColor: '#D4A34B', color: '#1A2336' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c4933a')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D4A34B')}
            >
              {loading ? 'Please wait...' : 'Get My Soulmate Sketch'}
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

