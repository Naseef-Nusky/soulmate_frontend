import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Who is GuruLink for?',
    a: 'GuruLink is for anyone curious about astrology — from beginners who want to learn the basics to enthusiasts seeking deeper, personalized insights. Whether you\'re exploring self-discovery, improving relationships, or simply curious about how the cosmos influences your life, GuruLink offers tailored guidance to help you navigate your journey.',
  },
  {
    q: 'Is GuruLink free to use?',
    a: 'No, GuruLink is a subscription-based service. However, we offer a 7-day trial for just $1.00* that provides full access to all features. Cancel within the trial period and you won\'t be charged further. If you continue, your subscription will automatically renew at the weekly plan starting at $14.99/biweekly*. Pricing will always be clearly presented during signup.',
  },
  {
    q: 'What if I\'m not satisfied with the service?',
    a: 'We\'re confident you\'ll find value in GuruLink, but if you\'re not satisfied or encounter technical issues, you may be eligible for a refund. Please refer to our Refund Policy for full details.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'Canceling is quick and easy. Visit our Help Center and follow the instructions. You\'ll retain access to GuruLink until the end of your current billing cycle.',
  },
  {
    q: 'Is my information safe?',
    a: 'Your privacy is our top priority. GuruLink is built with strict adherence to privacy laws, using advanced technical and organizational measures to protect your personal information from unauthorized access or disclosure. For more information, please review our Privacy Policy.',
  },
  {
    q: 'Can I ask an astrologer personal questions on GuruLink?',
    a: 'Absolutely! GuruLink connects you with professional astrologers who can answer personal questions. Whether it\'s guidance on your birth chart, a life situation, or a detailed palm reading, our astrologers provide personalized insights and advice.',
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
                  >
                    <span className="text-sm sm:text-base font-semibold">{item.q}</span>
                    <ChevronDown 
                      size={20} 
                      style={{ color: '#D4A34B' }}
                      className={`transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {open && (
                    <div className="px-4 pb-4 text-sm sm:text-base" style={{ color: '#666' }}>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
