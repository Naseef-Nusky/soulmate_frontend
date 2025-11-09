import { useState } from 'react';
import { Star, Check, Lock, ChevronDown, Globe } from 'lucide-react';
import { detectCurrency, setCurrency, getPricing, getAvailableCurrencies } from '../utils/currency.js';

export default function PreGenerationLanding({ onSubmit, email, loading = false }) {
  // Payment integration can be added here before calling onSubmit
  // For example: handlePayment().then(() => onSubmit())

	const faqs = [
		{
			q: 'How soon can I expect to receive my sketch and reading?',
			a: 'You will receive your sketch and reading within 24 hours. Our Artist & Astrologers require this time to carefully process your information and create a detailed and accurate portrait. Thank you for your patience!',
		},
		{
			q: 'What does my sketch include?',
			a: 'Your sketch includes a detailed portrait of your soulmate, created based on your answers and designed to represent the person most aligned with you. Along with the sketch, you’ll receive a karmic guide about your love connection, providing deeper insights into your destined bond.',
		},
		{
			q: 'Will I recognize my soulmate from the sketch?',
			a: 'Many users have shared incredible stories of recognizing their soulmate or meeting someone who resembles the sketch. While the portrait is based on traits most aligned with you, it’s also a guide to help you feel closer to your destined connection. Keep an open heart and mind!',
		},
		{
			q: 'What can I expect from the service?',
			a: 'Our service provides a personalized experience where you’ll receive a hand-drawn sketch of your soulmate, created using your answers and advanced AI insights. Along with the sketch, you’ll get a karmic love guide offering meaningful insights about your connection and what makes this relationship special. It’s a unique and exciting journey into discovering your destined partner!',
		},
		{
			q: 'How do I cancel my subscription?',
			a: "Canceling is simple and takes less than a few minutes. Visit our Help Center and follow the instructions. You'll maintain access until the end of your current billing period.",
		},
	];

	const [openFaq, setOpenFaq] = useState(null);
	const [currency, setCurrencyState] = useState(() => detectCurrency());
	const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
	const pricing = getPricing(currency);
	const availableCurrencies = getAvailableCurrencies();

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="py-3 px-4 rounded-t-lg flex items-center justify-between mb-4" style={{ backgroundColor: '#1A2336', color: '#F5F5F5' }}>
        <div className="text-sm font-semibold">Your Sketch offer: {pricing.trial.formatted}! Ends in 14:57</div>
        <div className="flex items-center gap-2">
          {/* Currency Selector */}
          <div className="relative">
            <button
              onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors border"
              style={{ 
                backgroundColor: 'rgba(26, 35, 54, 0.6)', 
                borderColor: 'rgba(212, 163, 75, 0.3)',
                color: '#F5F5F5'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#D4A34B'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(212, 163, 75, 0.3)'}
            >
              <Globe size={12} />
              <span>{currency}</span>
            </button>
            {showCurrencyMenu && (
              <div 
                className="absolute right-0 mt-2 rounded-lg shadow-lg border overflow-hidden z-50"
                style={{ 
                  backgroundColor: 'rgba(26, 35, 54, 0.95)',
                  borderColor: 'rgba(212, 163, 75, 0.3)',
                  minWidth: '200px',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}
              >
                {availableCurrencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setCurrency(curr.code);
                      setCurrencyState(curr.code);
                      setShowCurrencyMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between"
                    style={{ 
                      color: currency === curr.code ? '#D4A34B' : '#F5F5F5',
                      backgroundColor: currency === curr.code ? 'rgba(212, 163, 75, 0.1)' : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (currency !== curr.code) {
                        e.currentTarget.style.backgroundColor = 'rgba(212, 163, 75, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currency !== curr.code) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span>{curr.symbol} {curr.name}</span>
                    {currency === curr.code && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="text-xs px-3 py-1 rounded transition-colors" style={{ backgroundColor: '#D4A34B', color: '#1A2336' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c4933a'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D4A34B'}>
            Continue
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="rounded-lg shadow-lg p-8 mb-8 backdrop-blur-xl border" style={{ backgroundColor: 'rgba(26, 35, 54, 0.9)', borderColor: 'rgba(212, 163, 75, 0.3)' }}>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center" style={{ color: '#F5F5F5' }}>
          Your Sketch is Ready! See Your Soulmate Today!
        </h1>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-6">
          <div className="flex-1 text-center md:text-left">
            <div className="mb-2" style={{ color: 'rgba(212, 163, 75, 0.8)' }}>900+ users have seen their soulmate today.</div>
            <div className="mb-6" style={{ color: 'rgba(212, 163, 75, 0.8)' }}>
              Trusted by over 25 million people.
              <span className="flex items-center gap-1 justify-center md:justify-start mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} style={{ fill: '#D4A34B', color: '#D4A34B' }} />
                ))}
              </span>
            </div>
            <button 
              onClick={onSubmit}
              disabled={loading}
              className="font-bold py-4 px-8 rounded-lg text-lg transition disabled:opacity-50"
              style={{ backgroundColor: '#D4A34B', color: '#1A2336' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#c4933a')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#D4A34B')}
            >
              {loading ? 'Generating Your Sketch...' : 'Get My Soulmate Sketch'}
            </button>
          </div>
          <div className="flex-1 max-w-md">
            <div className="rounded-lg p-4 text-center border-2" style={{ backgroundColor: 'rgba(26, 35, 54, 0.6)', borderColor: 'rgba(212, 163, 75, 0.3)' }}>
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

      {/* Press Mentions */}
      <div className="py-6 mb-8 rounded-lg border" style={{ backgroundColor: 'rgba(26, 35, 54, 0.6)', borderColor: 'rgba(212, 163, 75, 0.3)' }}>
        <div className="flex items-center justify-center gap-8 flex-wrap opacity-70">
          <div className="font-bold" style={{ color: '#F5F5F5' }}>Forbes</div>
          <div className="font-bold" style={{ color: '#F5F5F5' }}>Mashable</div>
          <div className="font-bold" style={{ color: '#F5F5F5' }}>The Sun</div>
          <div className="font-bold" style={{ color: '#F5F5F5' }}>HELLO!</div>
          <div className="font-bold" style={{ color: '#F5F5F5' }}>Daily Mail</div>
          <div className="font-bold" style={{ color: '#F5F5F5' }}>yahoo!</div>
        </div>
      </div>

      {/* Benefits & Pricing Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Left: Benefits */}
        <div className="rounded-lg shadow p-6 backdrop-blur-xl border" style={{ backgroundColor: 'rgba(26, 35, 54, 0.9)', borderColor: 'rgba(212, 163, 75, 0.3)' }}>
          <div className="mb-4">
            <div className="text-sm mb-2" style={{ color: 'rgba(212, 163, 75, 0.8)' }}>996 people joined today</div>
            <div className="flex items-center gap-2 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 -ml-2" style={{ backgroundColor: '#D4A34B', borderColor: '#1A2336' }} />
              ))}
              <span className="text-sm" style={{ color: 'rgba(212, 163, 75, 0.8)' }}>+993</span>
            </div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#D4A34B' }}>WHY YOU CAN TRUST GURULINK'S SOULMATE SKETCH.</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Check size={20} className="mt-1 flex-shrink-0" style={{ color: '#D4A34B' }} />
              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#F5F5F5' }}>Authentic Artistic Expertise</h3>
                <p className="text-sm" style={{ color: 'rgba(245, 245, 245, 0.8)' }}>
                  Receive a hand-drawn sketch created by skilled artists and discover personality traits that make your connection unique.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check size={20} className="mt-1 flex-shrink-0" style={{ color: '#D4A34B' }} />
              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#F5F5F5' }}>Astrology-Driven Insights</h3>
                <p className="text-sm" style={{ color: 'rgba(245, 245, 245, 0.8)' }}>
                  Your sketch comes with astrological compatibility analysis, revealing deeper connections based on your birth chart.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check size={20} className="mt-1 flex-shrink-0" style={{ color: '#D4A34B' }} />
              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#F5F5F5' }}>Personalized Connection</h3>
                <p className="text-sm" style={{ color: 'rgba(245, 245, 245, 0.8)' }}>
                  Get a detailed description of your soulmate's personality, traits, and how you'll connect on an emotional level.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(212, 163, 75, 0.3)' }}>
            <div className="text-xs mb-2" style={{ color: 'rgba(212, 163, 75, 0.6)' }}>Featured In:</div>
            <div className="flex items-center gap-4 text-xs font-semibold" style={{ color: 'rgba(245, 245, 245, 0.8)' }}>
              <span>THE GLOBE AND MAIL</span>
              <span>BENZINGA</span>
              <span>barchart</span>
              <span>yahoo!</span>
            </div>
          </div>
        </div>

        {/* Right: Pricing */}
        <div className="rounded-lg shadow-lg p-6 border-2 backdrop-blur-xl" style={{ background: 'linear-gradient(to bottom right, rgba(212, 163, 75, 0.1), rgba(212, 163, 75, 0.05))', borderColor: 'rgba(212, 163, 75, 0.3)', backgroundColor: 'rgba(26, 35, 54, 0.9)' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: '#D4A34B' }}>Try GuruLink for 7 days</h3>
          
          <div className="space-y-4 mb-6">
            <div>
              <div className="text-3xl font-bold" style={{ color: '#D4A34B' }}>{pricing.trial.formatted}</div>
              <div className="text-sm" style={{ color: 'rgba(245, 245, 245, 0.8)' }}>for 7-day trial</div>
            </div>
            <div className="text-sm line-through" style={{ color: 'rgba(245, 245, 245, 0.6)' }}>{pricing.monthly.formatted}/month</div>
            
            <div className="rounded p-3 border" style={{ backgroundColor: 'rgba(212, 163, 75, 0.2)', borderColor: 'rgba(212, 163, 75, 0.4)' }}>
              <div className="text-sm font-semibold" style={{ color: '#D4A34B' }}>Promo Code GURULINK93 Applied</div>
              <div className="text-xs" style={{ color: '#D4A34B' }}>You save 93%</div>
            </div>

            <div className="pt-4" style={{ borderTop: '1px solid rgba(212, 163, 75, 0.3)' }}>
              <div className="text-sm mb-1" style={{ color: 'rgba(245, 245, 245, 0.8)' }}>Total Due:</div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg line-through" style={{ color: 'rgba(245, 245, 245, 0.5)' }}>{pricing.total.formatted}</span>
                <span className="text-3xl font-bold" style={{ color: '#D4A34B' }}>{pricing.trial.formatted}</span>
              </div>
              <div className="text-sm font-semibold mt-1" style={{ color: '#D4A34B' }}>You save 93%</div>
            </div>
          </div>

          <button 
            onClick={onSubmit}
            disabled={loading}
            className="w-full font-bold py-4 px-6 rounded-lg text-lg transition mb-4 disabled:opacity-50"
            style={{ backgroundColor: '#D4A34B', color: '#1A2336' }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#c4933a')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#D4A34B')}
          >
            {loading ? 'Generating Your Sketch...' : 'Get My Soulmate Sketch'}
          </button>

          <p className="text-xs text-center" style={{ color: 'rgba(245, 245, 245, 0.6)' }}>
            Cancel anytime. Your sketch will be ready instantly.
          </p>
        </div>
      </div>

      {/* User Portraits */}
      <div className="rounded-lg shadow p-6 mb-8 backdrop-blur-xl border" style={{ backgroundColor: 'rgba(26, 35, 54, 0.9)', borderColor: 'rgba(212, 163, 75, 0.3)' }}>
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#D4A34B' }}>Our Users' Soulmate Portraits</h2>
        <div className="rounded-lg overflow-hidden border-2" style={{ borderColor: 'rgba(212, 163, 75, 0.3)' }}>
          <img
            src="/soulmatePortrait2.png"
            alt="Examples of our users' soulmate portraits"
            className="w-full h-auto rounded-lg"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      {/* Karmic Love Guide */}
      <div className="rounded-lg shadow p-6 mb-8 backdrop-blur-xl border" style={{ backgroundColor: 'rgba(26, 35, 54, 0.9)', borderColor: 'rgba(212, 163, 75, 0.3)' }}>
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2" style={{ color: '#D4A34B' }}>
          <span>❤️</span> Karmic Love Guide
        </h2>
        <p className="mb-4" style={{ color: '#F5F5F5' }}>
          Finding a partner who shares your vision and complements your journey is one of life's greatest adventures. 
          Your soulmate sketch reveals not just appearance, but the deeper spiritual connection that binds you.
        </p>
        <div className="rounded p-4 flex items-center gap-3 border" style={{ backgroundColor: 'rgba(26, 35, 54, 0.6)', borderColor: 'rgba(212, 163, 75, 0.3)' }}>
          <Lock size={20} style={{ color: '#D4A34B' }} />
          <div>
            <div className="font-semibold text-sm" style={{ color: '#F5F5F5' }}>To read the full report, you need full access</div>
            <div className="text-xs" style={{ color: 'rgba(212, 163, 75, 0.8)' }}>Unlock complete insights with your sketch</div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="rounded-lg shadow p-6 mb-8 backdrop-blur-xl border" style={{ backgroundColor: 'rgba(26, 35, 54, 0.9)', borderColor: 'rgba(212, 163, 75, 0.3)' }}>
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#D4A34B' }}>Why does everyone love GuruLink?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Sarah M.', date: '2 weeks ago', text: 'I was skeptical at first, but when I met someone matching the sketch, I was amazed!' },
            { name: 'James K.', date: '1 month ago', text: 'The accuracy was incredible. My sketch helped me recognize my partner instantly.' },
            { name: 'Emma L.', date: '3 weeks ago', text: 'Best investment I\'ve made. The detailed insights were spot-on.' },
          ].map((testimonial, i) => (
            <div key={i} className="rounded-lg p-4 border" style={{ backgroundColor: 'rgba(26, 35, 54, 0.6)', borderColor: 'rgba(212, 163, 75, 0.3)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full" style={{ backgroundColor: '#D4A34B' }} />
                <div>
                  <div className="font-semibold" style={{ color: '#F5F5F5' }}>{testimonial.name}</div>
                  <div className="text-xs" style={{ color: 'rgba(212, 163, 75, 0.6)' }}>{testimonial.date}</div>
                </div>
              </div>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} style={{ fill: '#D4A34B', color: '#D4A34B' }} />
                ))}
              </div>
              <p className="text-sm" style={{ color: 'rgba(245, 245, 245, 0.8)' }}>"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>

		{/* FAQ Section */}
		<div className="rounded-lg shadow p-6 mb-8 backdrop-blur-xl border" style={{ backgroundColor: 'rgba(26, 35, 54, 0.9)', borderColor: 'rgba(212, 163, 75, 0.3)' }}>
			<h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#D4A34B' }}>Frequently Asked Questions</h2>
			<div className="border rounded-lg" style={{ borderColor: 'rgba(212, 163, 75, 0.3)' }}>
				{faqs.map((item, i) => {
					const open = openFaq === i;
					return (
						<div key={i} className={i > 0 ? 'border-t' : ''} style={{ borderColor: 'rgba(212, 163, 75, 0.3)' }}>
							<button
								onClick={() => setOpenFaq(open ? null : i)}
								className="w-full flex items-center justify-between p-4 text-left transition-colors"
								style={{ 
									color: '#F5F5F5',
									backgroundColor: open ? 'rgba(212, 163, 75, 0.1)' : 'transparent'
								}}
								onMouseEnter={(e) => !open && (e.currentTarget.style.backgroundColor = 'rgba(212, 163, 75, 0.05)')}
								onMouseLeave={(e) => !open && (e.currentTarget.style.backgroundColor = 'transparent')}
								aria-expanded={open}
								aria-controls={`faq-${i}`}
							>
								<span className="font-semibold">{item.q}</span>
								<ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: '#D4A34B' }} />
							</button>
							<div id={`faq-${i}`} className={`px-4 pb-4 ${open ? 'block' : 'hidden'}`} style={{ color: 'rgba(245, 245, 245, 0.8)' }}>
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
            <div className="text-sm opacity-90">Join 25+ million users who found their match</div>
          </div>
          <button 
            onClick={onSubmit}
            disabled={loading}
            className="font-bold py-3 px-8 rounded-lg disabled:opacity-50 transition"
            style={{ backgroundColor: '#D4A34B', color: '#1A2336' }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#c4933a')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#D4A34B')}
          >
            {loading ? 'Generating...' : 'Get My Soulmate Sketch'}
          </button>
        </div>
      </div>

      {/* Spacer for fixed bottom button */}
      <div className="h-24" />
      
      {/* Click outside to close currency menu */}
      {showCurrencyMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowCurrencyMenu(false)}
          style={{ backgroundColor: 'transparent' }}
        />
      )}
    </div>
  );
}

