import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { changeLanguage, getCurrentLanguage } from '../lib/translation.js';

export default function Footer() {
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (event) => {
      const lang = event.detail?.lang || getCurrentLanguage();
      setCurrentLang(lang);
    };
    window.addEventListener('gurulink:language-applied', handler);
    return () => window.removeEventListener('gurulink:language-applied', handler);
  }, []);

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
    changeLanguage(langCode);
  };

  return (
    <footer className="py-12" style={{ backgroundColor: '#1A2336', color: '#F5F5F5' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4 notranslate">
              <img src="/logoicon.png" alt="GuruLink" className="h-8 w-8 object-contain notranslate" />
              <div className="text-base sm:text-lg md:text-xl font-black notranslate">
                GuruLink<span style={{ color: '#D4A34B' }}>.app</span>
              </div>
            </div>
            <div className="flex gap-4 mb-4">
              <a href="#" className="hover:opacity-70 transition-opacity">
                <img src="/twitter.svg" alt="Twitter" className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a href="#" className="hover:opacity-70 transition-opacity">
                <img src="/instagram.svg" alt="Instagram" className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a href="#" className="hover:opacity-70 transition-opacity">
                <img src="/facebook.svg" alt="Facebook" className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            </div>
            <p className="text-xs sm:text-sm" style={{ color: 'rgba(245, 245, 245, 0.6)' }}>
              Copyright © 2025-{new Date().getFullYear()} GuruLink™. All rights reserved.
            </p>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold mb-4">Customer Support</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/support" className="hover:opacity-70 transition-opacity">Customer Support 24/7/365</Link></li>
              <li><Link to="/cancel-subscription" className="hover:opacity-70 transition-opacity">How to Cancel</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/privacy" className="hover:opacity-70 transition-opacity">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:opacity-70 transition-opacity">Terms &amp; Conditions</Link></li>
              <li><Link to="/cookies" className="hover:opacity-70 transition-opacity">Cookie Policy</Link></li>
              <li><Link to="/refund" className="hover:opacity-70 transition-opacity">Refund Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold mb-4">About Us</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/pricing" className="hover:opacity-70 transition-opacity">Pricing</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t" style={{ borderColor: 'rgba(212, 163, 75, 0.2)' }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
              <img 
                src="/payment_methods.png" 
                alt="Payment methods: Visa, Mastercard, Apple Pay, Google Pay" 
                className="h-8 sm:h-10 md:h-12 object-contain"
              />
            </div>
            <div style={{ minWidth: '200px' }}>
              {/* Language selection dropdown (uses server-side translation) */}
              <select 
                className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm w-full"
                style={{ backgroundColor: '#0F172A', color: '#F5F5F5', border: '1px solid rgba(212, 163, 75, 0.4)' }}
                value={currentLang}
                onChange={(e) => handleLanguageChange(e.target.value)}
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
          </div>
        </div>
      </div>
    </footer>
  );
}


