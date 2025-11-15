import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './components/HomePage.jsx';
import PricingPage from './components/PricingPage.jsx';
import QuizApp from './App.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import SoulmatePage from './components/SoulmatePage.jsx';
import Profile from './components/Profile.jsx';
import Terms from './components/Terms.jsx';
import Privacy from './components/Privacy.jsx';
import Cookies from './components/Cookies.jsx';
import Refund from './components/Refund.jsx';
import Support from './components/Support.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/quiz" element={<QuizApp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login isRegister={true} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/soulmate" element={<SoulmatePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/support" element={<Support />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}






