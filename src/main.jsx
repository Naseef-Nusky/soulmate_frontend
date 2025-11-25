import React from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './AppRouter.jsx';
import { initApi } from './lib/api.js';
import './styles.css';

// Initialize API configuration and test connectivity
initApi();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);







