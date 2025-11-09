import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserSoulmateSketch } from '../lib/api.js';
import { getUser } from '../lib/auth.js';

export default function SoulmatePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sketch, setSketch] = useState(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    loadSoulmateSketch();
  }, [navigate]);

  const loadSoulmateSketch = async () => {
    setLoading(true);
    try {
      const sketchData = await getUserSoulmateSketch();
      setSketch(sketchData);
    } catch (error) {
      console.error('Failed to load soulmate sketch:', error);
      // If no sketch, redirect to quiz
      navigate('/quiz');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: '#D4A34B' }} />
          <p className="mt-4" style={{ color: '#666' }}>Loading your soulmate sketch...</p>
        </div>
      </div>
    );
  }

  if (!sketch?.hasSketch || !sketch?.imageUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="text-center">
          <p className="text-lg mb-6" style={{ color: '#666' }}>No soulmate sketch found. Complete the quiz to generate your sketch.</p>
          <button
            onClick={() => navigate('/quiz')}
            className="px-8 py-4 rounded-lg font-bold text-lg transition-all hover:shadow-lg"
            style={{
              backgroundColor: '#D4A34B',
              color: '#1A2336',
            }}
          >
            Generate Your Soulmate Sketch
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <img src="/logoicon.png" alt="GuruLink" className="h-8 w-8 object-contain" />
              <div className="text-2xl font-black" style={{ color: '#1A2336' }}>
                GuruLink<span style={{ color: '#D4A34B' }}>.app</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-sm font-semibold rounded-lg transition-all"
              style={{ backgroundColor: 'rgba(212, 163, 75, 0.1)', color: '#1A2336' }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Soulmate Sketch Display */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side - Soulmate Sketch Image */}
          <div className="flex items-center justify-center">
            <div className="w-full rounded-xl border overflow-hidden shadow-lg" style={{ borderColor: 'rgba(212, 163, 75, 0.3)', backgroundColor: 'white' }}>
              <img 
                src={sketch.imageUrl} 
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
    </div>
  );
}

