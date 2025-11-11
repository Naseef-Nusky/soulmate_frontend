import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { getUser } from '../lib/auth.js';
import { getProfile, updateProfile } from '../lib/api.js';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    placeOfBirth: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    birthTime: '',
    relationshipStatus: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    
    // Load user profile data from API
    const loadProfile = async () => {
      try {
        const profile = await getProfile();
        if (profile) {
          // Parse birth date
          let birthDay = '';
          let birthMonth = '';
          let birthYear = '';
          if (profile.birth_date) {
            const date = new Date(profile.birth_date);
            birthDay = String(date.getDate()).padStart(2, '0');
            birthMonth = String(date.getMonth() + 1).padStart(2, '0');
            birthYear = String(date.getFullYear());
          }
          
          // Parse birth time (format: HH:MM:SS or HH:MM)
          let birthTime = '';
          if (profile.birth_time) {
            const timeParts = profile.birth_time.split(':');
            birthTime = `${timeParts[0]}:${timeParts[1]}`;
          }
          
          setFormData({
            name: profile.name || '',
            gender: profile.gender || '',
            placeOfBirth: profile.place_of_birth || '',
            birthDay,
            birthMonth,
            birthYear,
            birthTime,
            relationshipStatus: profile.relationship_status || '',
          });
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        // Fallback to user data from localStorage
        if (currentUser.birthDate) {
          const date = new Date(currentUser.birthDate);
          setFormData(prev => ({
            ...prev,
            name: currentUser.name || '',
            birthDay: String(date.getDate()).padStart(2, '0'),
            birthMonth: String(date.getMonth() + 1).padStart(2, '0'),
            birthYear: String(date.getFullYear()),
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            name: currentUser.name || '',
          }));
        }
      }
    };
    
    loadProfile();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // Format birth date
      let birthDate = null;
      if (formData.birthDay && formData.birthMonth && formData.birthYear) {
        birthDate = `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`;
      }

      // Format birth time (add seconds if needed)
      let birthTime = formData.birthTime || null;
      if (birthTime && !birthTime.includes(':')) {
        birthTime = null; // Invalid format
      } else if (birthTime) {
        // Ensure format is HH:MM:SS
        const parts = birthTime.split(':');
        if (parts.length === 2) {
          birthTime = `${birthTime}:00`;
        }
      }

      const profileData = {
        name: formData.name,
        gender: formData.gender,
        placeOfBirth: formData.placeOfBirth,
        birthDate,
        birthTime,
        relationshipStatus: formData.relationshipStatus,
      };

      const updatedProfile = await updateProfile(profileData);
      
      // Update local storage user data
      const currentUser = getUser();
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          name: updatedProfile.name,
          birthDate: updatedProfile.birth_date,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.message || 'Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeDefault = () => {
    setFormData(prev => ({ ...prev, birthTime: '12:00' }));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b" style={{ borderColor: 'rgba(212, 163, 75, 0.2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <img src="/logoicon.png" alt="GuruLink" className="h-8 w-8 object-contain" />
              <div className="text-2xl font-black" style={{ color: '#1A2336' }}>
                GuruLink<span style={{ color: '#D4A34B' }}>.app</span>
              </div>
            </div>
            {user?.name && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(212, 163, 75, 0.1)' }}
                >
                  <User size={20} style={{ color: '#D4A34B' }} />
                </div>
                <span className="text-sm font-semibold hidden sm:block" style={{ color: '#1A2336' }}>
                  {user.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all"
          style={{ backgroundColor: 'rgba(212, 163, 75, 0.1)', color: '#1A2336' }}
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-xl border p-8" style={{ borderColor: 'rgba(212, 163, 75, 0.3)' }}>
          <h1 className="text-3xl font-black mb-2" style={{ color: '#1A2336' }}>Profile</h1>
          <p className="text-lg mb-6" style={{ color: '#666' }}>View and update your profile data</p>

          {message && (
            <div className={`mb-6 p-4 rounded-lg text-sm ${
              message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1A2336' }}>
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border"
                style={{ borderColor: 'rgba(212, 163, 75, 0.3)', color: '#1A2336', backgroundColor: '#FFFFFF' }}
                placeholder="Enter your name"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1A2336' }}>
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border"
                style={{ borderColor: 'rgba(212, 163, 75, 0.3)', color: '#1A2336', backgroundColor: '#FFFFFF' }}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Place of Birth */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1A2336' }}>
                Place of birth
              </label>
              <input
                type="text"
                value={formData.placeOfBirth}
                onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border"
                style={{ borderColor: 'rgba(212, 163, 75, 0.3)', color: '#1A2336', backgroundColor: '#FFFFFF' }}
                placeholder="London, ENG, United Kingdom"
              />
              <p className="text-xs mt-1" style={{ color: '#666' }}>Don't know the city? Just add the country.</p>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1A2336' }}>
                Date of birth
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={2}
                  value={formData.birthDay}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                    setFormData({ ...formData, birthDay: value });
                  }}
                  className="w-20 px-4 py-3 rounded-lg border text-center"
                  style={{ borderColor: 'rgba(212, 163, 75, 0.3)', color: '#1A2336', backgroundColor: '#FFFFFF' }}
                  placeholder="01"
                />
                <span className="text-lg font-bold" style={{ color: '#666' }}>/</span>
                <input
                  type="text"
                  maxLength={2}
                  value={formData.birthMonth}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                    setFormData({ ...formData, birthMonth: value });
                  }}
                  className="w-20 px-4 py-3 rounded-lg border text-center"
                  style={{ borderColor: 'rgba(212, 163, 75, 0.3)', color: '#1A2336', backgroundColor: '#FFFFFF' }}
                  placeholder="10"
                />
                <span className="text-lg font-bold" style={{ color: '#666' }}>/</span>
                <input
                  type="text"
                  maxLength={4}
                  value={formData.birthYear}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setFormData({ ...formData, birthYear: value });
                  }}
                  className="w-24 px-4 py-3 rounded-lg border text-center"
                  style={{ borderColor: 'rgba(212, 163, 75, 0.3)', color: '#1A2336', backgroundColor: '#FFFFFF' }}
                  placeholder="1982"
                />
              </div>
            </div>

            {/* Time of Birth */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1A2336' }}>
                Time of birth
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="time"
                  value={formData.birthTime}
                  onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                  className="px-4 py-3 rounded-lg border"
                  style={{ borderColor: 'rgba(212, 163, 75, 0.3)', color: '#1A2336', backgroundColor: '#FFFFFF' }}
                />
                <button
                  type="button"
                  onClick={handleTimeDefault}
                  className="px-4 py-3 rounded-lg font-semibold text-sm transition-all"
                  style={{ backgroundColor: 'rgba(212, 163, 75, 0.1)', color: '#1A2336' }}
                >
                  I don't know. Set to default (12:00pm)
                </button>
              </div>
              <p className="text-xs mt-1" style={{ color: '#666' }}>
                Don't worry if you don't know the exact birth time, you can still find plenty of insights using the default setting.
              </p>
            </div>

            {/* Relationship Status */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1A2336' }}>
                Relationship Status
              </label>
              <select
                value={formData.relationshipStatus}
                onChange={(e) => setFormData({ ...formData, relationshipStatus: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border"
                style={{ borderColor: 'rgba(212, 163, 75, 0.3)', color: '#1A2336', backgroundColor: '#FFFFFF' }}
              >
                <option value="">Select relationship status</option>
                <option value="Single">Single</option>
                <option value="In a relationship">In a relationship</option>
                <option value="Engaged">Engaged</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 rounded-lg font-bold text-lg transition-all hover:shadow-lg disabled:opacity-50"
                style={{
                  backgroundColor: '#D4A34B',
                  color: '#1A2336',
                }}
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

