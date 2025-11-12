import { useEffect, useRef, useState } from 'react';

export default function Footer() {
  const translateElementRef = useRef(null);
  const [showCustomDropdown, setShowCustomDropdown] = useState(true); // Show custom dropdown by default

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;

    const initializeTranslate = () => {
      const element = document.getElementById('google_translate_element');
      if (element && window.google && window.google.translate) {
        try {
          // Clear any existing content
          element.innerHTML = '';
          
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'ar,da,de,en,es,fr,hu,it,ja,ko,nl,no,pl,pt,ro,sv,tr,el,bg,cs,et,fi,hr,lt,lv,ru,sk,uk,zh',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          }, 'google_translate_element');
          
          // Check if widget was created
          setTimeout(() => {
            const select = element.querySelector('select');
            if (!select && retryCount < maxRetries) {
              retryCount++;
              setTimeout(initializeTranslate, 500);
            } else if (!select) {
              setShowCustomDropdown(true);
            }
          }, 1000);
        } catch (error) {
          console.error('Error initializing Google Translate:', error);
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(initializeTranslate, 500);
          } else {
            setShowCustomDropdown(true);
          }
        }
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(initializeTranslate, 500);
      } else {
        setShowCustomDropdown(true);
      }
    };

    const loadScript = () => {
      if (window.google && window.google.translate) {
        initializeTranslate();
      } else {
        // Check if script already exists
        if (!document.querySelector('script[src*="translate_a/element.js"]')) {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
          script.async = true;
          script.onerror = () => {
            console.error('Failed to load Google Translate script');
            setShowCustomDropdown(true);
          };
          document.body.appendChild(script);
        }

        window.googleTranslateElementInit = () => {
          setTimeout(initializeTranslate, 100);
        };
      }
    };

    // Start loading after component mounts
    const timer = setTimeout(loadScript, 200);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleLanguageChange = (langCode) => {
    if (langCode === 'en') {
      // If English is selected, remove translation
      if (window.google && window.google.translate) {
        const select = document.querySelector('#google_translate_element select');
        if (select) {
          select.value = 'en';
          select.dispatchEvent(new Event('change'));
        }
      }
      // Remove Google Translate iframe if exists
      const iframe = document.querySelector('iframe[src*="translate"]');
      if (iframe) {
        iframe.remove();
      }
      // Reload to original language
      window.location.reload();
      return;
    }

    // Try to use Google Translate widget if available
    if (window.google && window.google.translate) {
      const select = document.querySelector('#google_translate_element select');
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
        return;
      }
    }

    // Fallback: if widget isn't available, inform the user (do not redirect to translate proxy on IPs)
    alert('Automatic translation is currently unavailable. Please disable ad blockers and ensure translate.google.com is reachable, or switch to a supported domain.');
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
              {/* Always show custom dropdown - Google Translate widget will appear above it if it loads */}
              <div id="google_translate_element" ref={translateElementRef} style={{ minHeight: '0px', marginBottom: '8px' }}></div>
              <select 
                className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm w-full"
                style={{ backgroundColor: 'rgba(212, 163, 75, 0.1)', color: '#F5F5F5', border: '1px solid rgba(212, 163, 75, 0.3)' }}
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


