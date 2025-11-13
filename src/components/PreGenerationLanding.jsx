import { useState } from 'react';
import { Star, Check, Lock, ChevronDown } from 'lucide-react';
import { detectCurrency, getPricing } from '../utils/currency.js';
import Footer from './Footer';

export default function PreGenerationLanding({ onSubmit, email, loading = false }) {
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

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32">
        {/* Hero Section */}
        <div className="rounded-lg shadow-lg p-8 mb-8 border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center" style={{ color: '#1A2336' }}>
            Your Sketch is Ready! See Your Soulmate Today!
          </h1>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-6">
            <div className="flex-1 text-center md:text-left">
              <div className="mb-2" style={{ color: '#D4A34B' }}>900+ users have seen their soulmate today.</div>
              <div className="mb-6" style={{ color: '#666' }}>
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
            <div className="flex items-center gap-2 mb-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 -ml-2 first:ml-0" style={{ backgroundColor: '#D4A34B', borderColor: '#FFFFFF' }} />
              ))}
              <div>
                <div className="text-sm" style={{ color: '#D4A34B' }}>996 people joined today</div>
                <div className="text-sm" style={{ color: '#666' }}>+993</div>
              </div>
            </div>

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
          <div className="rounded-lg shadow-lg p-6 border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#1A2336' }}>Try GuruLink for 7 days</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <div className="text-3xl font-bold" style={{ color: '#D4A34B' }}>{pricing.trial.formatted}</div>
                <div className="text-sm" style={{ color: '#666' }}>for 7-day trial</div>
              </div>
              <div className="text-sm line-through" style={{ color: '#9CA3AF' }}>{pricing.monthly.formatted}/month</div>
              
              <div className="rounded p-3 border" style={{ backgroundColor: '#FFF7EB', borderColor: '#F6D9A5' }}>
                <div className="text-sm font-semibold" style={{ color: '#B7791F' }}>Promo Code GURULINK93 Applied</div>
                <div className="text-xs" style={{ color: '#B7791F' }}>You save 93%</div>
              </div>

              <div className="pt-4" style={{ borderTop: '1px solid #E5E7EB' }}>
                <div className="text-sm mb-1" style={{ color: '#4B5563' }}>Total Due:</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg line-through" style={{ color: '#9CA3AF' }}>{pricing.total.formatted}</span>
                  <span className="text-3xl font-bold" style={{ color: '#D4A34B' }}>{pricing.trial.formatted}</span>
                </div>
                <div className="text-sm font-semibold mt-1" style={{ color: '#B7791F' }}>You save 93%</div>
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

            <p className="text-xs text-center" style={{ color: '#4B5563' }}>
              Cancel anytime. Your sketch will be ready instantly.
            </p>
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

        {/* Karmic Love Guide */}
        <div className="rounded-lg shadow p-6 mb-8 border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2" style={{ color: '#1A2336' }}>
            <span>❤️</span> Karmic Love Guide
          </h2>
          <p className="mb-4" style={{ color: '#4B5563' }}>
            Finding a partner who shares your vision and complements your journey is one of life's greatest adventures. 
            Your soulmate sketch reveals not just appearance, but the deeper spiritual connection that binds you.
          </p>
          <div className="rounded p-4 flex items-center gap-3 border" style={{ backgroundColor: '#F8FAFC', borderColor: '#E5E7EB' }}>
            <Lock size={20} style={{ color: '#D4A34B' }} />
            <div>
              <div className="font-semibold text-sm" style={{ color: '#1A2336' }}>To read the full report, you need full access</div>
              <div className="text-xs" style={{ color: '#4B5563' }}>Unlock complete insights with your sketch</div>
            </div>
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
        <div className="h-28" />
      </div>

      <Footer />
      <div className="pb-12" />
    </>
  );
}

