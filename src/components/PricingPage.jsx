import { Check, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import HowItWorks from './HowItWorks';
import FAQ from './FAQ';

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <Header />

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="font-semibold mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl" style={{ color: '#1A2336', fontFamily: 'Inter, sans-serif, "Hiragino Kaku Gothic"' }}>
            Unlock the Full Power of GuruLink
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: '#666' }}>
            Explore our flexible plans and choose the one that best supports your journey of self-discovery, guidance, and cosmic insight.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Trial Offer Card */}
          <div className="p-8 rounded-xl border-2" style={{ backgroundColor: 'white', borderColor: 'rgba(212, 163, 75, 0.3)' }}>
            <div className="mb-6">
              <div className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-4" style={{ backgroundColor: 'rgba(212, 163, 75, 0.1)', color: '#D4A34B' }}>
                TRIAL OFFER
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1A2336' }}>
                Try the full experience at a fraction of the cost.
              </h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-black" style={{ color: '#1A2336' }}>$1.00</span>
                <span className="text-lg" style={{ color: '#666' }}>*</span>
                <span className="text-lg ml-2" style={{ color: '#666' }}>/7-day trial</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                'Unlock the secrets of your destiny through personalized palmistry insights',
                'Get access to various astrological reports for deeper self-discovery',
                'Get compatibility readings to strengthen your relationships',
                '7-Day Risk-Free Trial for a fraction of the cost',
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={20} style={{ color: '#D4A34B', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: '#666' }}>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate('/quiz')}
              className="w-full px-8 py-4 text-lg font-bold rounded-lg transition-all shadow-lg"
              style={{ backgroundColor: '#1A2336', color: '#F5F5F5' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#D4A34B';
                e.currentTarget.style.color = '#1A2336';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1A2336';
                e.currentTarget.style.color = '#F5F5F5';
              }}
            >
              Get Started
            </button>
          </div>

          {/* Monthly Plan Card */}
          <div className="p-8 rounded-xl border-2" style={{ backgroundColor: 'white', borderColor: 'rgba(212, 163, 75, 0.3)' }}>
            <div className="mb-6">
              <div className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-4" style={{ backgroundColor: 'rgba(212, 163, 75, 0.1)', color: '#D4A34B' }}>
                MONTHLY PLAN
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1A2336' }}>
                Continue your journey with full access every month.
              </h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-black" style={{ color: '#1A2336' }}>$29.99</span>
                <span className="text-lg" style={{ color: '#666' }}>*</span>
                <span className="text-lg ml-2" style={{ color: '#666' }}>/month</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                'Everything in the trial',
                'Enjoy 1:1 live chats with professional astrologers for tailored guidance',
                'Personalized daily horoscopes to guide you every day',
                'Ongoing access to premium astrological insights and tools',
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={20} style={{ color: '#D4A34B', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: '#666' }}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-sm text-center" style={{ color: '#999' }}>
          *Prices may vary depending on your country and current promotions. You will be charged in your local currency.
        </p>
      </section>

      <HowItWorks />
      <FAQ />
      <Footer />
    </div>
  );
}

