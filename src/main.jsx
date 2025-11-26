import React from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './AppRouter.jsx';
import { initApi } from './lib/api.js';
import { applyTranslation, getCurrentLanguage } from './lib/translation.js';
import './styles.css';

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







