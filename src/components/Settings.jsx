import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../lib/auth.js';
import { getProfile } from '../lib/api.js';
import { getCurrentLanguage, changeLanguage } from '../lib/translation.js';

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [language, setLanguage] = useState(getCurrentLanguage());
  const [message, setMessage] = useState('');

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);

    const load = async () => {
      try {
        const profile = await getProfile();
        if (profile) {
          setUid(profile.id != null ? String(profile.id) : '');
          setEmail(profile.email || currentUser.email || '');
        } else {
          setUid('');
          setEmail(currentUser.email || '');
        }
      } catch {
        setUid('');
        setEmail(currentUser.email || '');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  const handleCopyUid = async () => {
    if (!uid) return;
    try {
      await navigator.clipboard.writeText(uid);
      setMessage('UID copied to clipboard');
      setTimeout(() => setMessage(''), 2500);
    } catch {
      setMessage('Unable to copy UID. Please copy manually.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    changeLanguage(lang);
  };

  const handleConfirm = () => {
    // For now, phone is local-only. Language is already applied via changeLanguage.
    setMessage('Settings updated');
    setTimeout(() => setMessage(''), 2500);
  };

  if (loading && !user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Header */}
      <header
        className="bg-white shadow-sm sticky top-0 z-50 border-b"
        style={{ borderColor: 'rgba(212, 163, 75, 0.2)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <img src="/logoicon.png" alt="GuruLink" className="h-8 w-8 object-contain" />
              <div className="text-2xl font-black" style={{ color: '#1A2336' }} data-notranslate>
                GuruLink<span style={{ color: '#D4A34B' }}>.app</span>
              </div>
            </div>
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
          ← Back to Dashboard
        </button>

        {/* Settings Card */}
        <div
          className="bg-white rounded-2xl shadow-xl border p-6 sm:p-8 space-y-6"
          style={{ borderColor: 'rgba(212, 163, 75, 0.3)' }}
        >
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black" style={{ color: '#1A2336' }}>
              Settings
            </h1>
            <p className="text-sm sm:text-base" style={{ color: '#666' }}>
              View and update your profile security settings
            </p>
          </div>

          {message && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs text-emerald-700">
              {message}
            </div>
          )}

          {/* UID */}
          <div className="space-y-1">
            <label className="text-xs font-semibold" style={{ color: '#6B7280' }}>
              UID
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={uid || 'Not available'}
                readOnly
                className="flex-1 rounded-xl border px-3 py-2 text-xs sm:text-sm bg-gray-50 cursor-default"
                style={{ borderColor: '#E5E7EB', color: '#111827' }}
              />
              <button
                type="button"
                onClick={handleCopyUid}
                className="rounded-xl px-3 py-2 text-xs font-semibold"
                style={{
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  border: '1px solid #E5E7EB',
                }}
              >
                Copy
              </button>
            </div>
            <p className="text-[11px]" style={{ color: '#9CA3AF' }}>
              This is your unique identifier (UID) which could be requested if you contact our
              support team.
            </p>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold" style={{ color: '#6B7280' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full rounded-xl border px-3 py-2 text-xs sm:text-sm bg-gray-50 cursor-not-allowed"
              style={{ borderColor: '#E5E7EB', color: '#111827' }}
            />
          </div>

          {/* Phone row */}
          <div className="space-y-1">
            <label className="text-xs font-semibold" style={{ color: '#6B7280' }}>
              Phone Number
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone number (with country code, e.g. +44...)"
                className="flex-1 rounded-xl border px-3 py-2 text-xs sm:text-sm"
                style={{ borderColor: '#E5E7EB', color: '#111827' }}
              />
            </div>
          </div>

          {/* Language */}
          <div className="space-y-1">
            <label className="text-xs font-semibold" style={{ color: '#6B7280' }}>
              Select language
            </label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-xs sm:text-sm"
              style={{ borderColor: '#E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
            >
              <option value="en">English</option>
              <option value="ar">عربية</option>
              <option value="da">Dansk</option>
              <option value="de">Deutsch</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="hu">Magyar</option>
              <option value="it">Italiano</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
              <option value="nl">Nederlands</option>
              <option value="no">Norsk</option>
              <option value="pl">Polski</option>
              <option value="pt">Português</option>
              <option value="ro">Română</option>
              <option value="sv">Svenska</option>
              <option value="tr">Türkçe</option>
              <option value="el">Ελληνικά</option>
              <option value="bg">Български</option>
              <option value="cs">Čeština</option>
              <option value="et">Eesti</option>
              <option value="fi">Suomi</option>
              <option value="hr">Hrvatski</option>
              <option value="lt">Lietuvių</option>
              <option value="lv">Latviešu</option>
              <option value="ru">Русский</option>
              <option value="sk">Slovenčina</option>
              <option value="uk">Українська</option>
              <option value="zh">中文</option>
            </select>
          </div>

          {/* Confirm button */}
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: '#2563EB' }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


