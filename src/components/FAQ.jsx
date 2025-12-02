import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Who is GuruLink designed for?',
    a: 'GuruLink is ideal for anyone interested in astrology — whether you’re just getting started or already passionate about understanding cosmic influences. From personal growth to relationship insights, our platform offers tailored guidance for every level of curiosity.',
  },
  {
    q: 'Is GuruLink free?',
    a: (
      <>
        GuruLink operates on a subscription model. Your 7-day trial is available for $1.* and includes full access to all features.
        <br /><br />
        You may cancel anytime during the trial with no further charges.
        <br /><br />
        If you continue, your subscription will automatically renew at the monthly rate of $29.99*.
        <br /><br />
        All pricing and renewal details will be shown clearly during signup.
      </>
    ),
  },
  {
    q: 'What if the service doesn’t meet my expectations?',
    a: 'If you’re not fully satisfied or encounter any issues, you may qualify for a refund. Please check our Refund Policy for complete information.',
  },
  {
    q: 'How can I cancel my subscription?',
    a: 'Canceling your subscription is simple. Head to our Help Center and follow the steps provided. Your access will remain active until the end of your current billing period.',
  },
  {
    q: 'Is my personal data secure?',
    a: (
      <>
        Protecting your privacy is extremely important to us. GuruLink follows strict privacy standards and uses advanced security measures to keep your information safe from unauthorized access. You can read more in our{' '}
        <Link to="/privacy" style={{ color: '#D4A34B' }}>Privacy Policy</Link>.
      </>
    ),
  },
  {
    q: 'What kind of astrology insights can I get on GuruLink?',
    a: 'GuruLink provides comprehensive astrology insights including personalized birth chart interpretations, daily horoscopes, compatibility readings, and detailed astrological reports tailored to your unique profile.',
  },
];

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-semibold mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl" style={{ color: '#1A2336', fontFamily: 'Inter, sans-serif, "Hiragino Kaku Gothic"' }}>Frequently asked questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((item, i) => {
              const open = openFaq === i;
              return (
                <div 
                  key={i}
                  className="border rounded-lg overflow-hidden"
                  style={{ borderColor: 'rgba(212, 163, 75, 0.2)' }}
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left transition-colors"
                    style={{ 
                      backgroundColor: open ? 'rgba(212, 163, 75, 0.05)' : 'transparent',
                      color: '#1A2336'
                    }}
                    aria-expanded={open}
                    aria-controls={`faq-answer-${i}`}
                  >
                    <span className="text-sm sm:text-base font-semibold">{item.q}</span>
                    <ChevronDown 
                      size={20} 
                      style={{ color: '#D4A34B' }}
                      className={`transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div
                    id={`faq-answer-${i}`}
                    className={`px-4 pb-4 text-sm sm:text-base transition-all duration-300 ${open ? 'block' : 'hidden'}`}
                    style={{ color: '#666' }}
                    aria-hidden={!open}
                  >
                    {item.a}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
