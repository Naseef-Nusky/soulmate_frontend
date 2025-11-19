import { useNavigate } from 'react-router-dom';

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-semibold text-center mb-8 sm:mb-12 text-2xl sm:text-3xl md:text-4xl lg:text-5xl" style={{ color: '#1A2336', fontFamily: 'Inter, sans-serif, "Hiragino Kaku Gothic"' }}>How GuruLink Works</h2>
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {[
            { step: 1, title: 'Complete the Registration Quiz', desc: '' },
            { step: 2, title: 'Add Your Payment Method', desc: '' },
            { 
              step: 3, 
              title: 'Receive Your Personalized Readings', 
              desc: '' 
            },
            { step: 4, title: 'Access Your Daily Astrology Insights', desc: '' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold"
                style={{ backgroundColor: '#D4A34B', color: '#1A2336' }}
              >
                {item.step}
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold" style={{ color: '#1A2336' }}>{item.title}</h3>
              {item.desc && <p className="text-xs sm:text-sm mt-2" style={{ color: '#666' }}>{item.desc}</p>}
            </div>
          ))}
        </div>
        <div className="text-center">
          <button
            onClick={() => navigate('/register')}
            className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold rounded-lg transition-all shadow-lg"
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
      </div>
    </section>
  );
}



