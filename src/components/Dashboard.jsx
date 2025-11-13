import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Sparkles, Home, Briefcase, Activity, Smile, Plane, Clover, ChevronDown, ChevronUp, Lightbulb, Heart, User, Settings, CreditCard, HelpCircle, FileText, Shield, LogOut } from 'lucide-react';
import { getNatalChart, getDailyHoroscope, getTomorrowHoroscope, getMonthlyHoroscope, getUserSoulmateSketch, updateSoulmateSketchSpeedOption } from '../lib/api.js';
import { getUser } from '../lib/auth.js';

const HOROSCOPE_SECTIONS_CONFIG = [
  { title: 'Personal Life', icon: Home, color: '#1D8BFF', badgeBg: 'rgba(29, 139, 255, 0.18)' },
  { title: 'Profession', icon: Briefcase, color: '#1A4AB5', badgeBg: 'rgba(26, 74, 181, 0.18)' },
  { title: 'Health', icon: Activity, color: '#E84552', badgeBg: 'rgba(232, 69, 82, 0.16)' },
  { title: 'Emotions', icon: Smile, color: '#6B3FC6', badgeBg: 'rgba(107, 63, 198, 0.16)' },
  { title: 'Travel', icon: Plane, color: '#1E9AAA', badgeBg: 'rgba(30, 154, 170, 0.16)' },
  { title: 'Luck', icon: Clover, color: '#2EB872', badgeBg: 'rgba(46, 184, 114, 0.16)' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('horoscope');
  const [horoscopeType, setHoroscopeType] = useState('today'); // today, tomorrow, monthly
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    natalChart: null,
    horoscope: null,
    soulmateSketch: null,
  });
  const [expandedSections, setExpandedSections] = useState({});
  const [showSoulmateSketch, setShowSoulmateSketch] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const hasCompletedQuiz = Boolean(data.soulmateSketch?.hasSketch);

  // Pre-generate all horoscopes in the background
  const preGenerateAllHoroscopes = async () => {
    try {
      // Generate all horoscopes in parallel (they will be cached in database)
      await Promise.all([
        getDailyHoroscope().catch(err => console.error('Failed to pre-generate daily horoscope:', err)),
        getTomorrowHoroscope().catch(err => console.error('Failed to pre-generate tomorrow horoscope:', err)),
        getMonthlyHoroscope().catch(err => console.error('Failed to pre-generate monthly horoscope:', err)),
        getNatalChart().catch(err => console.error('Failed to pre-generate natal chart:', err)),
      ]);
      console.log('[Dashboard] All horoscopes pre-generated successfully');
    } catch (error) {
      console.error('[Dashboard] Error pre-generating horoscopes:', error);
    }
  };

  const loadSoulmateSketch = async ({ force = false, silent = false } = {}) => {
    if (!force && data.soulmateSketch !== null) return; // Already loaded (null means no sketch)
    if (!silent) setLoading(true);
    let sketch = null;
    try {
      sketch = await getUserSoulmateSketch();
      setData(prev => ({ ...prev, soulmateSketch: sketch }));
      return sketch;
    } catch (error) {
      console.error('Failed to load soulmate sketch:', error);
      setData(prev => ({ ...prev, soulmateSketch: { hasSketch: false } }));
      return null;
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    
    // Check URL params for tab and soulmate display
    const tabParam = searchParams.get('tab');
    const showSoulmateParam = searchParams.get('showSoulmate');
    
    if (tabParam === 'insight') {
      setActiveTab('insight');
    }
    
    if (showSoulmateParam === 'true') {
      setShowSoulmateSketch(true);
      // Load soulmate sketch with spinner
      loadSoulmateSketch({ force: true });
      // Pre-generate all horoscopes
      preGenerateAllHoroscopes();
      // Clear URL params after using them
      setSearchParams({});
    } else {
      // Silently check if soulmate sketch exists (used for gating content)
      loadSoulmateSketch({ silent: true });
    }
    
    // Check if there's an initial horoscope from registration/login
    const initialHoroscope = localStorage.getItem('initialHoroscope');
    if (initialHoroscope) {
      try {
        const horoscopeData = JSON.parse(initialHoroscope);
        setData(prev => ({ ...prev, horoscope: horoscopeData }));
        // Clear it after using
        localStorage.removeItem('initialHoroscope');
      } catch (e) {
        console.error('Failed to parse initial horoscope:', e);
      }
    }
  }, [navigate, searchParams, setSearchParams]);

  useEffect(() => {
    if (data.soulmateSketch === null) return;
    if (!hasCompletedQuiz) {
      setData(prev => ({ ...prev, horoscope: null }));
      return;
    }
    if (!data.horoscope) {
      loadHoroscope('today');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.soulmateSketch]);

  useEffect(() => {
    if (data.soulmateSketch === null) return;
    if (!hasCompletedQuiz) {
      navigate('/quiz');
    }
  }, [data.soulmateSketch, hasCompletedQuiz, navigate]);

  const loadHoroscope = async (type = 'today') => {
    if (!hasCompletedQuiz) {
      return;
    }
    setLoading(true);
    try {
      let horoscope;
      if (type === 'tomorrow') {
        horoscope = await getTomorrowHoroscope();
      } else if (type === 'monthly') {
        horoscope = await getMonthlyHoroscope();
      } else {
        horoscope = await getDailyHoroscope();
      }
      setData(prev => ({ ...prev, horoscope }));
    } catch (error) {
      console.error('Failed to load horoscope:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHoroscopeTypeChange = (type) => {
    if (!hasCompletedQuiz) {
      if (data.soulmateSketch === null) {
        alert('We are still loading your soulmate information. Please try again in a moment.');
      } else {
        alert('Complete the soulmate quiz to unlock your personalized horoscope.');
        navigate('/quiz');
      }
      return;
    }
    setHoroscopeType(type);
    setData(prev => ({ ...prev, horoscope: null })); // Clear previous horoscope
    loadHoroscope(type);
  };

  // Parse horoscope sections from text
  const parseHoroscopeSections = (guidance) => {
    if (!guidance) return [];
    
    // For monthly horoscope, return as single section
    if (horoscopeType === 'monthly') {
      return [{
        title: 'Monthly Guidance',
        content: guidance,
        icon: Calendar,
      }];
    }
    
    // For daily/tomorrow, parse sections
    const sections = [];
    const sectionPatterns = [
      { pattern: /\*\*Personal Life\*\*/i, title: 'Personal Life', icon: Home },
      { pattern: /\*\*Profession\*\*/i, title: 'Profession', icon: Briefcase },
      { pattern: /\*\*Health\*\*/i, title: 'Health', icon: Activity },
      { pattern: /\*\*Emotions\*\*/i, title: 'Emotions', icon: Smile },
      { pattern: /\*\*Travel\*\*/i, title: 'Travel', icon: Plane },
      { pattern: /\*\*Luck\*\*/i, title: 'Luck', icon: Clover },
    ];
    
    let currentIndex = 0;
    sectionPatterns.forEach(({ pattern, title, icon }, index) => {
      const match = guidance.match(pattern);
      if (match) {
        const startIndex = match.index + match[0].length;
        const nextSection = sectionPatterns.slice(index + 1).find(s => {
          const nextMatch = guidance.match(s.pattern);
          return nextMatch && nextMatch.index > startIndex;
        });
        
        const endIndex = nextSection ? guidance.match(nextSection.pattern).index : guidance.length;
        const content = guidance.substring(startIndex, endIndex).trim();
        
        if (content) {
          sections.push({ title, content, icon });
        }
      }
    });
    
    // If no sections found, return full text as single section
    if (sections.length === 0) {
      return [{
        title: 'Daily Guidance',
        content: guidance,
        icon: Calendar,
      }];
    }
    
    return sections;
  };

  const loadNatalChart = async () => {
    if (!hasCompletedQuiz) {
      alert('Complete the soulmate quiz to unlock your personalized personality insights.');
      navigate('/quiz');
      return;
    }
    if (data.natalChart) return;
    setLoading(true);
    try {
      const chart = await getNatalChart();
      setData(prev => ({ ...prev, natalChart: chart }));
    } catch (error) {
      console.error('Failed to load natal chart:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b" style={{ borderColor: 'rgba(212, 163, 75, 0.2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <img src="/logoicon.png" alt="GuruLink" className="h-8 w-8 object-contain" />
              <div className="text-2xl font-black" style={{ color: '#1A2336' }}>
                GuruLink<span style={{ color: '#D4A34B' }}>.app</span>
              </div>
            </div>
            <div className="flex items-center gap-4 relative">
              {/* Profile Icon with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-3 px-4 py-2 rounded-full transition-all hover:shadow-lg"
                  style={{ backgroundColor: 'rgba(212, 163, 75, 0.1)' }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(212, 163, 75, 0.2)' }}
                >
                  <User size={20} style={{ color: '#D4A34B' }} />
                  </div>
                  {user?.name && (
                    <span className="text-sm font-semibold hidden sm:block" style={{ color: '#1A2336' }}>
                      {user.name}
                    </span>
                  )}
                </button>
                
                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowProfileDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 rounded-xl border shadow-xl bg-white z-50" style={{ borderColor: 'rgba(212, 163, 75, 0.3)' }}>
                      <div className="p-4 border-b" style={{ borderColor: 'rgba(212, 163, 75, 0.2)' }}>
                        <p className="text-xs font-semibold mb-1" style={{ color: '#666' }}>Signed in as</p>
                        <p className="text-sm font-medium" style={{ color: '#1A2336' }}>{user?.email || 'user@example.com'}</p>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            navigate('/profile');
                          }}
                          className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
                          style={{ color: '#1A2336' }}
                        >
                          <User size={18} style={{ color: '#666' }} />
                          <span className="text-sm">Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            // Navigate to settings
                          }}
                          className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
                          style={{ color: '#1A2336' }}
                        >
                          <Settings size={18} style={{ color: '#666' }} />
                          <span className="text-sm">Settings</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            // Navigate to payment details
                          }}
                          className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
                          style={{ color: '#1A2336' }}
                        >
                          <CreditCard size={18} style={{ color: '#666' }} />
                          <span className="text-sm">Payment Details</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            // Navigate to help center
                          }}
                          className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
                          style={{ color: '#1A2336' }}
                        >
                          <HelpCircle size={18} style={{ color: '#666' }} />
                          <span className="text-sm">Help Center</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            navigate('/terms');
                          }}
                          className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
                          style={{ color: '#1A2336' }}
                        >
                          <FileText size={18} style={{ color: '#666' }} />
                          <span className="text-sm">Terms & Conditions</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            navigate('/privacy');
                          }}
                          className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
                          style={{ color: '#1A2336' }}
                        >
                          <Shield size={18} style={{ color: '#666' }} />
                          <span className="text-sm">Privacy Policy</span>
                        </button>
                        <div className="border-t my-1" style={{ borderColor: 'rgba(212, 163, 75, 0.2)' }} />
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            handleLogout();
                          }}
                          className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-red-50 transition-colors"
                          style={{ color: '#DC2626' }}
                        >
                          <LogOut size={18} style={{ color: '#DC2626' }} />
                          <span className="text-sm font-semibold">Log Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto sm:overflow-visible">
          {[
            { id: 'horoscope', label: 'Daily Horoscope', icon: Calendar },
            { id: 'personality', label: 'Your Core Personality', icon: Sparkles },
            { id: 'insight', label: 'Insights', icon: Lightbulb },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'personality') loadNatalChart();
                if (tab.id === 'horoscope') loadHoroscope(horoscopeType);
                if (tab.id === 'insight') {
                  setShowSoulmateSketch(false); // Reset to insights list when switching to insight tab
                  // Load soulmate sketch if not already loaded
                  if (data.soulmateSketch === null) {
                    loadSoulmateSketch();
                  }
                }
              }}
              style={{
                backgroundColor: activeTab === tab.id ? '#D4A34B' : 'white',
                color: activeTab === tab.id ? '#1A2336' : '#666',
                border: `1px solid ${activeTab === tab.id ? '#D4A34B' : 'rgba(212, 163, 75, 0.3)'}`
              }}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm sm:text-base rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id ? '' : 'opacity-70'
              } ${activeTab === tab.id ? 'shadow-sm' : ''} flex-1 sm:flex-none min-w-[180px]`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl border p-6 sm:p-8" style={{ borderColor: 'rgba(212, 163, 75, 0.3)' }}>
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: '#D4A34B' }} />
              <p className="mt-4" style={{ color: '#666' }}>Loading your astrological insights...</p>
            </div>
          )}

          {!loading && activeTab === 'horoscope' && (
            <div>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-6">
                <div className="space-y-3">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold"
                    style={{ backgroundColor: 'rgba(212, 163, 75, 0.15)', color: '#8B5E20' }}
                  >
                    {horoscopeType === 'tomorrow'
                      ? 'Tomorrow'
                      : horoscopeType === 'monthly'
                      ? 'Monthly'
                      : 'Today'}
                    ’s Horoscope
                  </div>
                  <h2 className="text-3xl font-black" style={{ color: '#1A2336', letterSpacing: '-0.02em' }}>
                    {horoscopeType === 'tomorrow'
                      ? "Tomorrow's Horoscope"
                      : horoscopeType === 'monthly'
                      ? "Monthly Horoscope"
                      : "Today's Horoscope"}
                </h2>
                  <p className="text-sm font-medium uppercase tracking-wide" style={{ color: '#888' }}>
                    {horoscopeType === 'monthly' && data.horoscope?.monthName
                      ? `${data.horoscope.monthName} ${data.horoscope.year}`
                      : data.horoscope
                      ? new Date(data.horoscope.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : ''}
                  </p>
                </div>
                
                {/* Horoscope Type Selector */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleHoroscopeTypeChange('today')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      horoscopeType === 'today' ? '' : 'opacity-70'
                    }`}
                    style={{
                      backgroundColor: horoscopeType === 'today' ? '#D4A34B' : 'white',
                      color: horoscopeType === 'today' ? '#1A2336' : '#666',
                      border: `1px solid ${horoscopeType === 'today' ? '#D4A34B' : 'rgba(212, 163, 75, 0.3)'}`
                    }}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => handleHoroscopeTypeChange('tomorrow')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      horoscopeType === 'tomorrow' ? '' : 'opacity-70'
                    }`}
                    style={{
                      backgroundColor: horoscopeType === 'tomorrow' ? '#D4A34B' : 'white',
                      color: horoscopeType === 'tomorrow' ? '#1A2336' : '#666',
                      border: `1px solid ${horoscopeType === 'tomorrow' ? '#D4A34B' : 'rgba(212, 163, 75, 0.3)'}`
                    }}
                  >
                    Tomorrow
                  </button>
                  <button
                    onClick={() => handleHoroscopeTypeChange('monthly')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      horoscopeType === 'monthly' ? '' : 'opacity-70'
                    }`}
                    style={{
                      backgroundColor: horoscopeType === 'monthly' ? '#D4A34B' : 'white',
                      color: horoscopeType === 'monthly' ? '#1A2336' : '#666',
                      border: `1px solid ${horoscopeType === 'monthly' ? '#D4A34B' : 'rgba(212, 163, 75, 0.3)'}`
                    }}
                  >
                    Month
                  </button>
                </div>
              </div>
              
              {data.horoscope ? (
                <div className="space-y-6">
                  {/* Horoscope Sections as Cards */}
                  <div className="space-y-5">
                    {(() => {
                      const sections = parseHoroscopeSections(data.horoscope.guidance || data.horoscope);

                      if (horoscopeType === 'monthly') {
                        const monthlyContent = sections?.[0]?.content || data.horoscope.guidance || '';
                        return (
                          <div
                            key={`${horoscopeType}-monthly`}
                            className="rounded-2xl border shadow-sm"
                            style={{
                              borderColor: 'rgba(26, 35, 54, 0.08)',
                              background: 'linear-gradient(135deg, rgba(255,255,255,0.97), rgba(247, 249, 252, 0.92))',
                            }}
                          >
                            <div className="px-6 py-6 space-y-3">
                              <h3 className="text-xl font-semibold" style={{ color: '#1A2336', letterSpacing: '-0.01em' }}>
                                Monthly Guidance
                              </h3>
                              <p className="text-base leading-7 whitespace-pre-wrap" style={{ color: '#2F394B' }}>
                                {monthlyContent}
                              </p>
                            </div>
                          </div>
                        );
                      }

                      const sectionMap = new Map();
                      sections.forEach(section => {
                        sectionMap.set(section.title.toLowerCase(), section.content);
                      });

                      return HOROSCOPE_SECTIONS_CONFIG.map(({ title, icon: IconComponent, color, badgeBg }) => {
                        const content = sectionMap.get(title.toLowerCase());
                        if (!content) return null;

                    return (
                      <div 
                            key={`${horoscopeType}-${title}`}
                            className="rounded-2xl border shadow-sm"
                            style={{
                              borderColor: 'rgba(26, 35, 54, 0.08)',
                              background: 'linear-gradient(135deg, rgba(255,255,255,0.97), rgba(247, 249, 252, 0.92))',
                            }}
                          >
                            <div className="px-6 py-5">
                              <div className="flex flex-col sm:flex-row items-start gap-4">
                                <div
                                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ 
                                    backgroundColor: badgeBg,
                                    color,
                        }}
                      >
                                  {IconComponent ? <IconComponent size={26} /> : null}
                      </div>
                                <div className="flex-1 space-y-2">
                                  <h3
                                    className="text-xl font-semibold"
                                    style={{ color: '#1A2336', letterSpacing: '-0.01em' }}
                                  >
                                    {title}
                            </h3>
                                  <p
                                    className="text-base leading-7 whitespace-pre-wrap"
                                    style={{ color: '#2F394B' }}
                                  >
                                    {content}
                                  </p>
                    </div>
                  </div>
                      </div>
                    </div>
                    );
                      });
                    })()}
                  </div>
                </div>
              ) : hasCompletedQuiz ? (
                <p style={{ color: '#666' }}>Loading your horoscope...</p>
              ) : (
                <div className="text-center py-12 space-y-4" style={{ color: '#1A2336' }}>
                  <h3 className="text-2xl font-black">Complete the Soulmate Quiz First</h3>
                  <p className="text-lg" style={{ color: '#666' }}>
                    Take the soulmate quiz to unlock your personalized horoscope and insights.
                  </p>
                  <button
                    onClick={() => navigate('/quiz')}
                    className="px-8 py-3 rounded-lg font-bold text-lg transition-all hover:shadow-lg"
                    style={{ backgroundColor: '#D4A34B', color: '#1A2336' }}
                  >
                    Start Soulmate Quiz
                  </button>
                </div>
              )}
            </div>
          )}

          {!loading && activeTab === 'personality' && (
            <div>
              {hasCompletedQuiz ? (
                data.natalChart ? (
                <div className="space-y-6">
                  {(() => {
                    const report = data.natalChart.report || '';
                    if (!report) {
                      return <p style={{ color: '#666' }}>Loading your personality report...</p>;
                    }

                    // Parse the report into sections
                    const sections = [];
                    const lines = report.split('\n');
                    let currentSection = null;
                    let currentSubsection = null;
                    let currentContent = [];

                    for (let i = 0; i < lines.length; i++) {
                      const line = lines[i].trim();
                      
                      // Main section: "Your core personality"
                      if (line === '**Your core personality**' || line === 'Your core personality') {
                        if (currentSection) {
                          sections.push(currentSection);
                        }
                        currentSection = {
                          title: 'Your core personality',
                          intro: '',
                          subsections: [],
                        };
                        continue;
                      }

                      // Subsection headers like "**Sun**", "**Moon**", etc.
                      if (line.match(/^\*\*(Sun|Moon|Rising-sign|Mercury|Jupiter|Mars|Venus|Saturn|Uranus|Neptune|Pluto)\*\*$/i)) {
                        if (currentSubsection && currentContent.length > 0) {
                          currentSubsection.content = currentContent.join('\n').trim();
                          if (currentSection) {
                            currentSection.subsections.push(currentSubsection);
                          }
                        }
                        const planet = line.replace(/\*\*/g, '').trim();
                        currentSubsection = {
                          planet: planet,
                          title: '',
                          content: '',
                        };
                        currentContent = [];
                        continue;
                      }

                      // Subsection titles like "Your identity", "Your emotions", etc.
                      if (line.match(/^(Your identity|Your emotions|Your image|Your expression|Your aspirations|Your fortune|Your view on love|Your discipline|Your individuality|Your imagination|Your power)$/i)) {
                        if (currentSubsection) {
                          currentSubsection.title = line;
                        }
                        continue;
                      }

                      // "A little more about you" section
                      if (line === '**A little more about you**' || line === 'A little more about you') {
                        if (currentSection) {
                          sections.push(currentSection);
                        }
                        currentSection = {
                          title: 'A little more about you',
                          intro: '',
                          subsections: [],
                        };
                        continue;
                      }

                      // Intro text like "There are three key pillars to your personality"
                      if (line && !line.startsWith('**') && currentSection && currentSection.subsections.length === 0 && !currentSubsection) {
                        if (currentSection.intro) {
                          currentSection.intro += ' ' + line;
                        } else {
                          currentSection.intro = line;
                        }
                        continue;
                      }

                      // Content for subsections
                      if (line && currentSubsection) {
                        currentContent.push(line);
                      }
                    }

                    // Add last subsection
                    if (currentSubsection && currentContent.length > 0) {
                      currentSubsection.content = currentContent.join('\n').trim();
                      if (currentSection) {
                        currentSection.subsections.push(currentSubsection);
                      }
                    }

                    // Add last section
                    if (currentSection) {
                      sections.push(currentSection);
                    }

                    // If parsing failed, display raw report
                    if (sections.length === 0) {
                      return (
                <div className="prose max-w-none" style={{ color: '#1A2336' }}>
                          <div className="whitespace-pre-wrap">{report}</div>
                </div>
                      );
                    }

                    return sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="space-y-6">
                        <div>
                          <h3 className="text-2xl font-black mb-2 uppercase" style={{ color: '#1A2336' }}>
                            {section.title.toUpperCase()}
                          </h3>
                          {section.intro && (
                            <p className="text-lg mb-4 uppercase" style={{ color: '#666' }}>
                              {section.intro.toUpperCase()}
                            </p>
              )}
            </div>

                        {section.subsections.map((subsection, subIndex) => {
                          const sectionKey = `${sectionIndex}-${subIndex}`;
                          const isExpanded = expandedSections[sectionKey] !== undefined 
                            ? expandedSections[sectionKey] 
                            : sectionIndex === 0; // Expand first section by default
                          
                          return (
                            <div 
                              key={subIndex}
                              className="rounded-xl border transition-all"
                              style={{ 
                                borderColor: 'rgba(212, 163, 75, 0.3)',
                                backgroundColor: 'white',
                                overflow: 'hidden',
                              }}
                            >
                              <button
                                onClick={() => {
                                  setExpandedSections(prev => ({
                                    ...prev,
                                    [sectionKey]: !isExpanded
                                  }));
                                }}
                                className="w-full p-4 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                                style={{ backgroundColor: isExpanded ? 'rgba(212, 163, 75, 0.05)' : 'white' }}
                              >
                                <div className="flex-1">
                                  <h4 className="text-lg sm:text-xl font-bold uppercase mb-1 sm:mb-2" style={{ color: '#D4A34B' }}>
                                    {subsection.planet.toUpperCase()}
                                  </h4>
                                  {subsection.title && (
                                    <h5 className="text-sm sm:text-lg font-semibold uppercase" style={{ color: '#1A2336' }}>
                                      {subsection.title.toUpperCase()}
                                    </h5>
              )}
                </div>
                                <div className="flex-shrink-0 flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wide" style={{ color: '#D4A34B' }}>
                                  <span>{isExpanded ? 'Hide' : 'View'}</span>
                                  <div
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border"
                                    style={{
                                      borderColor: 'rgba(212, 163, 75, 0.3)',
                                      backgroundColor: 'rgba(212, 163, 75, 0.1)',
                                    }}
                                  >
                                  {isExpanded ? (
                                      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#D4A34B' }} />
              ) : (
                                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#D4A34B' }} />
              )}
                                  </div>
            </div>
                </button>
                              {isExpanded && (
                                <div className="px-4 sm:px-6 pb-6">
                                  <div className="prose max-w-none text-sm sm:text-base" style={{ color: '#1A2336', lineHeight: '1.8' }}>
                                    <p className="whitespace-pre-wrap leading-relaxed">{subsection.content}</p>
                      </div>
                    </div>
                  )}
                </div>
                          );
                        })}
                      </div>
                    ));
                  })()}
                </div>
              ) : (
                <p style={{ color: '#666' }}>Loading your personality report...</p>
                )
              ) : (
                <div className="text-center py-12 space-y-4" style={{ color: '#1A2336' }}>
                  <h3 className="text-2xl font-black">Complete the Soulmate Quiz First</h3>
                  <p className="text-lg" style={{ color: '#666' }}>
                    Take the soulmate quiz to unlock your core personality insights.
                  </p>
                  <button
                    onClick={() => navigate('/quiz')}
                    className="px-8 py-3 rounded-lg font-bold text-lg transition-all hover:shadow-lg"
                    style={{ backgroundColor: '#D4A34B', color: '#1A2336' }}
                  >
                    Start Soulmate Quiz
                  </button>
                </div>
              )}
            </div>
          )}

          {!loading && activeTab === 'insight' && (
            <div>
              {showSoulmateSketch && data.soulmateSketch?.hasSketch && data.soulmateSketch?.imageUrl ? (
                <div>
                  {/* Back Button */}
                  <button
                    onClick={() => setShowSoulmateSketch(false)}
                    className="mb-6 px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                    style={{ backgroundColor: 'rgba(212, 163, 75, 0.1)', color: '#1A2336' }}
                  >
                    ← Back to Insights
                  </button>

                  {/* Soulmate Sketch Display */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Side - Soulmate Sketch Image */}
                    <div className="flex items-center justify-center">
                      <div className="w-full rounded-xl border overflow-hidden shadow-lg" style={{ borderColor: 'rgba(212, 163, 75, 0.3)', backgroundColor: 'white' }}>
                        <img 
                          src={data.soulmateSketch.imageUrl} 
                          alt="Soulmate sketch" 
                          className="w-full h-auto object-contain"
                          style={{ backgroundColor: '#F9F9F9' }}
                        />
                      </div>
                    </div>
                    
                    {/* Right Side - Text Content */}
                    <div className="flex flex-col justify-center">
                      <h2 className="text-3xl font-black mb-4" style={{ color: '#1A2336' }}>
                        Welcome to Your Soulmate Story{user?.name ? `, ${user.name}` : ''}
                      </h2>
                      <div className="space-y-4 text-lg" style={{ color: '#666', lineHeight: '1.8' }}>
                        <p>
                          Inside, you'll discover a beautifully crafted sketch of your soulmate, along with a captivating story of where and how you'll meet.
                        </p>
                        <p>
                          This exciting journey into your romantic future is closely tied to your personal astrology. Your Star Sign reveals your outward personality and charisma, while your Venus Sign uncovers your deepest desires in love, hidden talents, and the key to finding your perfect match.
                        </p>
                        <p>
                          Get ready to uncover the magical details of your soulmate connection and the love story that awaits.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Soulmate Sketch Reading Card */}
                  <div className="p-6 sm:p-8 rounded-xl border bg-white" style={{ borderColor: 'rgba(212, 163, 75, 0.3)' }}>
                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
                      <div className="flex-shrink-0">
                        <Heart size={32} style={{ color: '#D4A34B' }} />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl sm:text-3xl font-black mb-4" style={{ color: '#1A2336' }}>Soulmate Sketch Reading</h2>
                        <p className="text-base sm:text-lg mb-6" style={{ color: '#666', lineHeight: '1.8' }}>
                          See your soulmate through a personalized sketch and explore the romantic potential destined for you.
                        </p>
                        <button
                          onClick={async () => {
                            // Load soulmate sketch and show it
                            setLoading(true);
                            try {
                              const sketch = await loadSoulmateSketch({ force: true, silent: true });
                              const result = sketch || data.soulmateSketch;
                              if (result?.hasSketch && result?.imageUrl) {
                                setShowSoulmateSketch(true);
                              } else {
                                navigate('/quiz');
                              }
                            } catch (error) {
                              console.error('Failed to load soulmate sketch:', error);
                              navigate('/quiz');
                            } finally {
                              setLoading(false);
                            }
                          }}
                          className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all hover:shadow-lg"
                          style={{
                            backgroundColor: '#D4A34B',
                            color: '#1A2336',
                          }}
                        >
                          Access Soulmate Sketch Reading
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Additional features can be added here */}
                  {/* Example: Other insight features */}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}






















