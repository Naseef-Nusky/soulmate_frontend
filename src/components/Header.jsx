import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b" style={{ borderColor: 'rgba(212, 163, 75, 0.2)' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/logoicon.png" alt="GuruLink" className="h-6 w-6 sm:h-8 sm:w-8 object-contain" />
            <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-black" style={{ color: '#1A2336' }}>
              GuruLink<span style={{ color: '#D4A34B' }}>.app</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-colors"
              style={{ color: '#1A2336' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#D4A34B'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#1A2336'}
            >
              Log In
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all"
              style={{ backgroundColor: '#1A2336', color: '#F5F5F5' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f1419'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1A2336'}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

