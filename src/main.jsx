import React from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './AppRouter.jsx';
import { initApi } from './lib/api.js';
import { applyTranslation, getCurrentLanguage } from './lib/translation.js';
import './styles.css';

// Initialize vConsole for mobile debugging (works in production)
// Console logs are now enabled in production for debugging purposes
if (typeof window !== 'undefined') {
  // Detect mobile devices
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
    (window.Capacitor || window.CapacitorWeb || window.capacitor);
  
  // Initialize vConsole for mobile devices (always enabled for debugging)
  if (isMobile) {
    import('vconsole').then((VConsole) => {
      // Only initialize if not already initialized
      if (!window.vConsole) {
        window.vConsole = new VConsole.default({
          theme: 'dark', // 'light' or 'dark'
          defaultPlugins: ['system', 'network', 'element', 'storage'],
          maxLogNumber: 1000,
          onReady: function() {
            console.log('[vConsole] Mobile console initialized for debugging');
          },
          onClearLog: function() {
            console.log('[vConsole] Logs cleared');
          }
        });
        console.log('[vConsole] ✅ Mobile console enabled - tap the vConsole button to view logs');
      }
    }).catch((err) => {
      console.warn('[vConsole] Failed to load vConsole:', err);
    });
  }
  
  // Console logs are enabled in production for debugging
  // All console.log, console.error, console.warn, etc. will work normally
  console.log('[App] Console logs enabled in production mode');
}

// Initialize API configuration and test connectivity
initApi();

// Restore and apply saved language preference on app load
if (typeof window !== 'undefined') {
  const savedLang = getCurrentLanguage();
  if (savedLang && savedLang !== 'en') {
    // Wait for DOM to be ready, then apply translation
    setTimeout(() => {
      applyTranslation(savedLang, { silent: true });
    }, 500);
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);







