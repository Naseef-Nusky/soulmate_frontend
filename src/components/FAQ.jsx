import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Who is GuruLink for?',
    a: 'GuruLink is designed for anyone curious about astrology, seeking guidance in their personal life, relationships, or career decisions. Whether you\'re a beginner or experienced in astrology, GuruLink provides accessible and personalized insights.',
  },
  {
    q: 'Is GuruLink free to use?',
    a: 'GuruLink offers a 7-day trial for just $1.00, giving you full access to personalized readings, daily horoscopes, and 1-on-1 consultations with professional astrologers. After the trial, the subscription is $29.99/month.',
  },
  {
    q: 'What if I\'m not satisfied with the product?',
    a: 'We offer a satisfaction guarantee. If you\'re not happy with your experience, you can cancel your subscription at any time through your account settings or by contacting our 24/7 customer support.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'Canceling is simple and takes less than a few minutes. Visit our Help Center or contact Customer Support 24/7/365. You\'ll maintain access until the end of your current billing period.',
  },
  {
    q: 'Is my information safe?',
    a: 'Yes, we take your privacy and data security seriously. All personal information is encrypted and stored securely. We never share your data with third parties. You can review our Privacy Policy for more details.',
  },
  {
    q: 'Can I ask an astrologer personal questions on GuruLink?',
    a: 'Absolutely! GuruLink provides 1-on-1 live chat access to professional astrologers where you can ask personal questions and receive tailored guidance based on your birth chart and specific life situations.',
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
