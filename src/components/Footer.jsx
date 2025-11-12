import { useEffect, useRef, useState } from 'react';
import { translateTexts } from '../lib/api.js';

export default function Footer() {
  const translateElementRef = useRef(null);
  const [showCustomDropdown, setShowCustomDropdown] = useState(true); // kept for future UI toggles

  // No Google Website Widget: server-side translation only

  const handleLanguageChange = (langCode) => {
    if (langCode === 'en') {
      // Reload to original English content
      window.location.reload();
      return;
    }

    // Use server-side Google Cloud Translation API to translate visible text nodes
    (async () => {
      try {
        const root = document.getElementById('root');
        if (!root) return alert('Unable to access page root for translation.');

        // Collect visible text nodes
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
          acceptNode: (node) => {
            if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
            const text = node.nodeValue.trim();
            // skip very short texts and whitespace-only
            if (text.length < 2) return NodeFilter.FILTER_REJECT;
            // skip text inside script/style/noscript
            const p = node.parentElement;
            if (!p) return NodeFilter.FILTER_REJECT;
            const tag = p.tagName?.toLowerCase();
            if (['script', 'style', 'noscript', 'select', 'option'].includes(tag)) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          }
        });

        const nodes = [];
        let n;
        const maxNodes = 300; // safety cap
        while ((n = walker.nextNode()) && nodes.length < maxNodes) {
          nodes.push(n);
        }

        if (nodes.length === 0) {
          return alert('Nothing to translate on this view.');
        }

        const texts = nodes.map(node => node.nodeValue);
        const { translations } = await translateTexts({ texts, target: langCode });
        if (!Array.isArray(translations) || translations.length !== nodes.length) {
          return alert('Translation service returned an unexpected response.');
        }

        // Apply translations in-place
        for (let i = 0; i < nodes.length; i++) {
          nodes[i].nodeValue = translations[i];
        }
      } catch (err) {
        console.error('Translate fallback error:', err);
        alert('Automatic translation is unavailable. Please try again later.');
      }
    })();
  };

  return (
    <footer className="py-12" style={{ backgroundColor: '#1A2336', color: '#F5F5F5' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logoicon.png" alt="GuruLink" className="h-8 w-8 object-contain" />
              <div className="text-base sm:text-lg md:text-xl font-black">
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
              Copyright © 2024-2025 GuruLink™. All rights reserved.
            </p>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold mb-4">Customer Support</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><a href="#" className="hover:opacity-70 transition-opacity">How to Cancel</a></li>
              <li><a href="#" className="hover:opacity-70 transition-opacity">Customer Support 24/7/365</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><a href="#" className="hover:opacity-70 transition-opacity">Privacy Policy</a></li>
              <li><a href="#" className="hover:opacity-70 transition-opacity">Terms & Conditions</a></li>
              <li><a href="#" className="hover:opacity-70 transition-opacity">Cookie Policy</a></li>
              <li><a href="#" className="hover:opacity-70 transition-opacity">Refund Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold mb-4">About Us</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><a href="#" className="hover:opacity-70 transition-opacity">Help Center</a></li>
              <li><a href="#" className="hover:opacity-70 transition-opacity">Pricing</a></li>
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
                defaultValue="en"
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


