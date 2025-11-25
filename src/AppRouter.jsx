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
import CancelSubscription from './components/CancelSubscription.jsx';
import CancellationPortal from './components/CancellationPortal.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function isMobileAppEnvironment() {
  if (typeof window === 'undefined') return false;
  const protocol = window.location?.protocol;
  const hostname = window.location?.hostname;
  const port = window.location?.port;
  const userAgent = window.navigator?.userAgent || '';

  return Boolean(
    window.Capacitor ||
      window.CapacitorWeb ||
      window.capacitor ||
      protocol === 'capacitor:' ||
      protocol === 'file:' ||
      userAgent.includes('Capacitor') ||
      (hostname === 'localhost' && !port && protocol === 'https:')
  );
}

function RootEntryGate() {
  if (isMobileAppEnvironment()) {
    return <Navigate to="/quiz" replace />;
  }
  return <HomePage />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<RootEntryGate />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/quiz" element={<QuizApp />} />
        <Route path="/register/quiz" element={<QuizApp />} />
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
        <Route path="/cancel-subscription" element={<CancelSubscription />} />
        <Route path="/cancellation-portal" element={<CancellationPortal />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}







