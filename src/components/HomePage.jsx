import { Check, Star, Users, Shield, MessageCircle, Heart, Sparkles, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Header from './Header';
import Footer from './Footer';
import HowItWorks from './HowItWorks';
import FAQ from './FAQ';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-24">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Image - First on mobile, second on desktop */}
          <div className="flex justify-center order-1 lg:order-2 w-full">
            <div className="relative max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-full">
              <img 
                src="/astrology_wheel.png" 
                alt="Astrology wheel" 
                className="w-full h-auto"
              />
            </div>
          </div>
          {/* Text and Button - Second on mobile, first on desktop */}
          <div className="order-2 lg:order-1 text-center lg:text-left w-full">
            <h1 className="font-semibold mb-4 sm:mb-6 leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl" style={{ color: '#1A2336', fontFamily: 'Inter, sans-serif, "Hiragino Kaku Gothic"' }}>
              Discover your life's path with the power of modern astrology
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8" style={{ color: '#666' }}>
              The leading app that makes astrology simple and accessible for deeper self-awareness
            </p>
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold rounded-lg transition-all shadow-lg"
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

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <img 
              src="/astrologyFeatures.png" 
              alt="Astrological insights" 
              className="w-full rounded-2xl shadow-xl"
            />
          </div>
          <div>
            <h2 className="font-semibold mb-6 sm:mb-8 text-2xl sm:text-3xl md:text-4xl lg:text-5xl" style={{ color: '#1A2336', fontFamily: 'Inter, sans-serif, "Hiragino Kaku Gothic"' }}>
              Why Choose GuruLink?
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(212, 163, 75, 0.1)' }}>
                  <Sparkles size={24} style={{ color: '#D4A34B' }} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2" style={{ color: '#1A2336' }}>Individual Astrology Analysis</h3>
                  <p className="text-sm sm:text-base" style={{ color: '#666' }}>
                    GuruLink combines AI intelligence with NASA's precise data to deliver custom birth chart interpretations, helping you explore your unique astrological identity and life journey.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(212, 163, 75, 0.1)' }}>
                  <Heart size={24} style={{ color: '#D4A34B' }} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2" style={{ color: '#1A2336' }}>Birth Chart Match Insights</h3>
                  <p className="text-sm sm:text-base" style={{ color: '#666' }}>
                    Discover how your astrological signs align with others — gain meaningful insights into compatibility, connection, and relationship dynamics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: Sparkles, title: 'Tailored Astrological Insights', desc: '' },
            { icon: Heart, title: 'Compatibility Analysis', desc: '' },
            { icon: Globe, title: 'Detailed Birth Chart Interpretation', desc: '' },
            { icon: Shield, title: 'Secure & Private', desc: '' },
          ].map((feature, i) => (
            <div 
              key={i}
              className="p-6 rounded-xl border transition-all hover:shadow-lg"
              style={{ 
                backgroundColor: 'white',
                borderColor: 'rgba(212, 163, 75, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#D4A34B';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 163, 75, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <feature.icon size={32} style={{ color: '#D4A34B' }} className="mb-4" />
              <h3 className="text-sm sm:text-base md:text-lg font-bold" style={{ color: '#1A2336' }}>{feature.title}</h3>
              {feature.desc && <p className="text-xs sm:text-sm mt-2" style={{ color: '#666' }}>{feature.desc}</p>}
            </div>
          ))}
        </div>
      </section>

      <HowItWorks />

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { value: '96%', label: 'Users recommend GuruLink Spiritual Guidance', icon: Star },
            { value: '750k', label: 'Astrology readings completed', icon: Star },
            { value: '4.8/5', label: 'Stars satisfaction score', icon: Star },
          ].map((stat, i) => (
            <div 
              key={i}
              className="text-center p-8 rounded-xl border"
              style={{ 
                backgroundColor: 'white',
                borderColor: 'rgba(212, 163, 75, 0.2)'
              }}
            >
              <stat.icon size={40} style={{ color: '#D4A34B' }} className="mx-auto mb-4" />
              <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2" style={{ color: '#1A2336' }}>{stat.value}</div>
              <p className="text-xs sm:text-sm md:text-base" style={{ color: '#666' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section 
        className="py-16 lg:py-24 text-center relative overflow-hidden"
        style={{ 
          backgroundImage: "url('/transformBackground.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(26, 35, 54, 0.7)' }} />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full" style={{ backgroundColor: '#D4A34B' }} />
          <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full" style={{ backgroundColor: '#D4A34B' }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="font-semibold mb-6 sm:mb-8 text-2xl sm:text-3xl md:text-4xl lg:text-5xl" style={{ color: '#F5F5F5', fontFamily: 'Inter, sans-serif, "Hiragino Kaku Gothic"' }}>
            It's time to change your life through the power of astrology
          </h2>
          <button
            onClick={() => navigate('/register')}
            className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold rounded-lg transition-all shadow-lg"
            style={{ backgroundColor: '#D4A34B', color: '#1A2336' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#c4933a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#D4A34B';
            }}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Why Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <h2 className="font-semibold text-center mb-8 sm:mb-12 text-2xl sm:text-3xl md:text-4xl lg:text-5xl" style={{ color: '#1A2336', fontFamily: 'Inter, sans-serif, "Hiragino Kaku Gothic"' }}>Why GuruLink Deserves Your Trust</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: '',
              desc: 'We blend authentic astronomical data with timeless astrological wisdom to deliver accurate and insightful guidance about your life journey and relationships.',
            },
            {
              icon: MessageCircle,
              title: '',
              desc: 'We\'re honored by the positive feedback from our users who have discovered clarity, direction, and self-understanding through GuruLink\'s personalized astrology readings.',
            },
            {
              icon: Users,
              title: '',
              desc: 'GuruLink provides personalized astrology insights and guidance based on your birth chart and individual life path.',
            },
          ].map((item, i) => (
            <div 
              key={i}
              className="p-8 rounded-xl border text-center"
              style={{ 
                backgroundColor: 'white',
                borderColor: 'rgba(212, 163, 75, 0.2)'
              }}
            >
              <item.icon size={48} style={{ color: '#D4A34B' }} className="mx-auto mb-4" />
              {item.title && <h3 className="text-base sm:text-lg md:text-xl font-bold mb-4" style={{ color: '#1A2336' }}>{item.title}</h3>}
              <p className="text-sm sm:text-base" style={{ color: '#666' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-semibold mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl" style={{ color: '#1A2336', fontFamily: 'Inter, sans-serif, "Hiragino Kaku Gothic"' }}>Thousands have discovered their direction through GuruLink</h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} style={{ fill: '#D4A34B', color: '#D4A34B' }} />
              ))}
            </div>
          </div>
          <div className="relative px-12 sm:px-16">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
              }}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              loop={true}
              className="testimonials-swiper"
            >
              {[
                { name: 'Anika R.', text: 'The birth chart reading gave me so much clarity about my career and life direction. Truly eye-opening!', date: '1 week ago' },
                { name: 'Michael L.', text: 'I was amazed by how detailed my personalized horoscope was. It felt like it truly understood me!', date: '1 week ago' },
                { name: 'Priya S.', text: 'The personalized astrology insights were so detailed and insightful. The guidance I received changed how I view my relationships.', date: '1 week ago' },
                { name: 'Jonathan K.', text: 'I love how accurate the predictions are. Every reading feels personal and deeply meaningful.', date: '1 week ago' },
                { name: 'Emily D.', text: 'GuruLink has become my daily companion. The astrology insights keep me grounded and inspired every morning.', date: '1 week ago' },
              ].map((testimonial, i) => (
                <SwiperSlide key={i}>
                  <div 
                    className="p-6 rounded-xl border h-full"
                    style={{ 
                      backgroundColor: '#F5F5F5',
                      borderColor: 'rgba(212, 163, 75, 0.2)'
                    }}
                  >
                    <div className="mb-4">
                      <div className="text-sm sm:text-base font-bold" style={{ color: '#1A2336' }}>{testimonial.name}</div>
                      <div className="text-xs sm:text-sm" style={{ color: '#666' }}>Verified Customer • {testimonial.date}</div>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={16} style={{ fill: '#D4A34B', color: '#D4A34B' }} />
                      ))}
                    </div>
                    <p className="text-sm sm:text-base" style={{ color: '#666' }}>"{testimonial.text}"</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Custom Navigation Buttons */}
            <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 hidden sm:flex" style={{ backgroundColor: '#1A2336', color: '#D4A34B' }}>
              <ChevronLeft size={24} />
            </button>
            <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 hidden sm:flex" style={{ backgroundColor: '#1A2336', color: '#D4A34B' }}>
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Trial Offer */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="bg-white rounded-2xl shadow-xl border p-8 sm:p-12" style={{ borderColor: 'rgba(212, 163, 75, 0.3)' }}>
          <div className="text-center mb-8">
            <h2 className="font-semibold mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl" style={{ color: '#1A2336', fontFamily: 'Inter, sans-serif, "Hiragino Kaku Gothic"' }}>Try GuruLink for 7 Days</h2>
            <p className="text-base sm:text-lg md:text-xl" style={{ color: '#666' }}>
              Discover your destiny with personalized readings and expert guidance.
            </p>
          </div>
          <ul className="space-y-4 mb-8 max-w-2xl mx-auto">
            {[
              'Get detailed astrology insights made just for you',
              'Access personalized birth chart readings',
              'Enjoy daily horoscopes that inspire and guide you',
              'After your 7-day trial (£1.00), your subscription continues at £29.99/month.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check size={20} style={{ color: '#D4A34B', flexShrink: 0, marginTop: '2px' }} />
                <span className="text-sm sm:text-base" style={{ color: '#666' }}>{item}</span>
              </li>
            ))}
          </ul>
          <div className="text-center">
            <button
              onClick={() => navigate('/pricing')}
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
              See Pricing
            </button>
          </div>
        </div>
      </section>

      <FAQ />
      <Footer />
    </div>
  );
}
