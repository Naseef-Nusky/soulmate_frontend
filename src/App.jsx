import { useMemo, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProgressBar from './components/ProgressBar.jsx';
import QuizStep from './components/QuizStep.jsx';
import ResultView from './components/ResultView.jsx';
import PreGenerationLanding from './components/PreGenerationLanding.jsx';
import { submitQuiz, requestGeneration, getJobStatus, getResult, sendSketchReadyEmail, checkAccountExists } from './lib/api.js';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { getUser } from './lib/auth.js';

const STEPS = [
  { key: 'intro', title: 'Ready to discover your soulmate fate?' },
  { key: 'socialProof', title: 'Why GuruLink' },
  { key: 'gender1', title: 'Your Gender' },
  { key: 'gender2', title: 'Confirm Gender' },
  { key: 'ageRange', title: "Soulmate's Age" },
  { key: 'ethnicity', title: 'Ethnic Background' },
  { key: 'appearanceImportance', title: "Importance of Appearance" },
  { key: 'keyTrait', title: 'Key Trait' },
  { key: 'traitFeedback', title: 'Trait Feedback' },
  { key: 'birth', title: 'Date of Birth' },
  { key: 'element', title: 'Personality Element' },
  { key: 'decisionMaking', title: 'Decision-Making' },
  { key: 'decisionFeedback1', title: 'Astro Insight' },
  { key: 'challenge', title: 'Personal Challenge' },
  { key: 'challengeFeedback', title: 'Challenge Feedback' },
  { key: 'redFlag', title: 'Biggest Red Flag' },
  { key: 'partnerPreference', title: 'Partner Preference' },
  { key: 'relationshipDynamic', title: 'Relationship Dynamic' },
  { key: 'loveLanguage', title: 'Love Language' },
  { key: 'idealConnection', title: 'Ideal Connection' },
  { key: 'relationshipFear', title: 'Relationship Fear' },
  { key: 'lifeGoals', title: 'Life Goals' },
  { key: 'preparing', title: 'Preparing Insights' },
  { key: 'portraitReady', title: 'Portrait Ready' },
  { key: 'email', title: 'Send Results' },
  { key: 'promoCode', title: 'Exclusive Promo Code' },
  { key: 'preGenerationLanding', title: 'Get Your Sketch' },
];

// Export as QuizApp for routing
export default function QuizApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  
  // Check if coming from signup based on URL path
  const isFromSignup = location.pathname === '/register/quiz';
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [job, setJob] = useState({ id: null, status: null, resultId: null });
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [form, setForm] = useState({
    gender: '',
    genderConfirm: '',
    ageRange: '',
    ethnicity: '',
    appearanceImportance: '',
    keyTraits: [],
    birthDate: '',
    birthTime: '',
    birthCity: '',
    element: '',
    decisionMaking: '',
    challenge: '',
    redFlag: '',
    partnerPreference: '',
    relationshipDynamic: '',
    loveLanguage: '',
    idealConnection: '',
    relationshipFear: '',
    lifeGoals: [],
    warningAcknowledged: false,
    email: '',
  });

  // Check for payment success on mount and restore quiz data
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const paymentSuccess = searchParams.get('payment');
    
    if (sessionId && paymentSuccess === 'success') {
      // Payment was successful - restore quiz data from localStorage and jump to PreGenerationLanding
      const quizDataStr = localStorage.getItem('quizData');
      if (quizDataStr) {
        try {
          const quizData = JSON.parse(quizDataStr);
          if (quizData.answers) {
            // Restore form state from quiz data
            setForm({
              ...quizData.answers,
              warningAcknowledged: quizData.answers.warningAcknowledged || false,
            });
            if (quizData.email) {
              setSubmittedEmail(quizData.email);
            }
            console.log('[QuizApp] Quiz data restored from localStorage after payment success');
          }
        } catch (e) {
          console.error('[QuizApp] Failed to parse quiz data from localStorage:', e);
        }
      }
      
      // Jump to PreGenerationLanding step (index 36)
      const preGenStepIndex = STEPS.findIndex(s => s.key === 'preGenerationLanding');
      if (preGenStepIndex !== -1) {
        setStep(preGenStepIndex);
        console.log('[QuizApp] Jumped to PreGenerationLanding step after payment success');
      }
    }
  }, [searchParams]);

  // Reset form when returning to intro step (but not if payment was successful)
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const paymentSuccess = searchParams.get('payment');
    const isPaymentSuccess = sessionId && paymentSuccess === 'success';
    
    // Don't reset form if payment was successful - we want to preserve quiz data
    if (step === 0 && !isPaymentSuccess) {
      setForm({
        gender: '',
        genderConfirm: '',
        ageRange: '',
        ethnicity: '',
        appearanceImportance: '',
        keyTraits: [],
        birthDate: '',
        birthTime: '',
        birthCity: '',
        element: '',
        decisionMaking: '',
        challenge: '',
        redFlag: '',
        partnerPreference: '',
        relationshipDynamic: '',
        loveLanguage: '',
        idealConnection: '',
        relationshipFear: '',
        lifeGoals: [],
        warningAcknowledged: false,
        email: '',
      });
    }
  }, [step, searchParams]);

  // Auto-fill email when email step is reached (ONLY if coming from signup)
  useEffect(() => {
    const emailStepIndex = STEPS.findIndex(s => s.key === 'email');
    if (step === emailStepIndex) {
      // ONLY auto-fill email if coming from signup process
      if (isFromSignup) {
        const signupEmail = localStorage.getItem('signupEmail');
        if (signupEmail) {
          const emailToFill = signupEmail.trim().toLowerCase();
          setForm(prev => ({ ...prev, email: emailToFill }));
          console.log('[QuizApp] ✅ User came from signup (URL: /register/quiz) - email auto-filled and locked:', emailToFill);
        } else {
          console.warn('[QuizApp] ⚠️ Coming from signup but no signupEmail found in localStorage');
        }
      } else {
        // Coming directly to quiz - do NOT pre-fill email, user must type it
        console.log('[QuizApp] User came directly to quiz - email field will be empty and editable');
        // Clear any existing email if user navigated directly
        if (form.email && !localStorage.getItem('signupEmail')) {
          setForm(prev => ({ ...prev, email: '' }));
        }
      }
    }
  }, [step, isFromSignup]);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  async function onSubmit() {
    setLoading(true);
    setResult(null);
    setSubmittedEmail(form.email);
    try {
      // Check if account already exists
      let accountExists = false;
      if (form.email) {
        try {
          const checkResult = await checkAccountExists(form.email);
          accountExists = checkResult.exists || false;
        } catch (err) {
          console.error('Failed to check account existence:', err);
          // Continue with flow if check fails
        }
      }

      const payload = {
        answers: { ...form },
        birthDetails: {
          date: form.birthDate,
          time: form.birthTime || null,
          city: form.birthCity || null,
        },
        email: form.email || null,
      };
      
      // Save complete quiz data to localStorage for use after payment
      localStorage.setItem('quizData', JSON.stringify({
        answers: { ...form },
        birthDetails: {
          date: form.birthDate,
          time: form.birthTime || null,
          city: form.birthCity || null,
        },
        email: form.email || null,
        timestamp: new Date().toISOString(),
      }));
      
      // Clear signupEmail after quiz submission (it's now saved in quizData)
      if (localStorage.getItem('signupEmail')) {
        localStorage.removeItem('signupEmail');
        console.log('[QuizApp] Signup email cleared after quiz submission');
      }
      
      const res = await submitQuiz(payload);
      setResult(res);
      setJob({ id: null, status: null, resultId: null });

      // If account exists, skip PreGenerationLanding and redirect to login
      if (accountExists) {
        setStep(STEPS.length);
        if (form.email) {
          try {
            await sendSketchReadyEmail(form.email);
          } catch (err) {
            console.error('Failed to send sketch email', err);
          }
        }
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Account doesn't exist, show PreGenerationLanding page
        const preGenStepIndex = STEPS.findIndex(s => s.key === 'preGenerationLanding');
        if (preGenStepIndex !== -1) {
          setStep(preGenStepIndex);
        } else {
          setStep(STEPS.length);
        }
      }
    } catch (e) {
      alert('Failed to generate results. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  const progress = Math.min(step / STEPS.length, 1);

  useJobPolling(job, setJob, setResult, setStep);

  const isNextDisabled = useMemo(() => {
    if (step >= STEPS.length) return false;
    const key = STEPS[step]?.key;
    if (loading) return true;
    switch (key) {
      case 'gender1': return !form.gender;
      case 'gender2': return !form.genderConfirm;
      case 'ageRange': return !form.ageRange;
      case 'ethnicity': return !form.ethnicity;
      case 'appearanceImportance': return !form.appearanceImportance;
      case 'keyTrait': return form.keyTraits.length === 0;
      case 'birth': return !form.birthDate;
      case 'element': return !form.element;
      case 'decisionMaking': return !form.decisionMaking;
      case 'challenge': return !form.challenge;
      case 'redFlag': return !form.redFlag;
      case 'partnerPreference': return !form.partnerPreference;
      case 'relationshipDynamic': return !form.relationshipDynamic;
      case 'loveLanguage': return !form.loveLanguage;
      case 'idealConnection': return !form.idealConnection;
      case 'relationshipFear': return !form.relationshipFear;
      case 'lifeGoals': return form.lifeGoals.length === 0;
      case 'email': return !form.email;
      case 'preGenerationLanding': return false;
      default: return false;
    }
  }, [step, form, loading]);

  if (step === STEPS.length) {
    return (
      <div 
        className="min-h-screen"
        style={{
          backgroundColor: '#F5F5F5'
        }}
      >
        <div className="max-w-3xl mx-auto p-6">
          <ResultView
            result={result}
            email={submittedEmail}
            onRestart={() => { 
            setStep(0); 
            setResult(null);
            setJob({ id: null, status: null, resultId: null });
            setSubmittedEmail('');
            setForm({
              gender: '',
              genderConfirm: '',
              ageRange: '',
              ethnicity: '',
              appearanceImportance: '',
              keyTraits: [],
              birthDate: '',
              birthTime: '',
              birthCity: '',
              element: '',
              decisionMaking: '',
              challenge: '',
              redFlag: '',
              partnerPreference: '',
              relationshipDynamic: '',
              loveLanguage: '',
              idealConnection: '',
              relationshipFear: '',
              lifeGoals: [],
              warningAcknowledged: false,
              email: '',
            });
          }} />
        </div>
      </div>
    );
  }

  if (STEPS[step]?.key === 'preGenerationLanding') {
    return (
      <div 
        className="w-full min-h-screen"
        style={{
          backgroundColor: '#F5F5F5'
        }}
      >
        <PreGenerationLanding 
          onSubmit={onSubmit}
          email={form.email}
          name={form.name || form.fullName || ''}
          birthDate={form.birthDate || null}
          formData={form} // Pass full form data so quiz data can be reconstructed
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundColor: '#F5F5F5'
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header with logo theme */}
        <div className="flex items-center justify-between mb-6">
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-2xl disabled:opacity-30 transition-all duration-200 disabled:cursor-not-allowed border shadow-sm" 
            style={{ 
              color: '#1A2336',
              backgroundColor: '#FFFFFF',
              borderColor: '#E5E7EB',
              boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.08)'
            }}
            onClick={prev} 
            disabled={step === 0} 
            aria-label="Back"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-medium hidden sm:inline">Back</span>
          </button>
          
          <div className="flex items-center gap-3">
            <img 
              src="/logoicon.png" 
              alt="GuruLink" 
              className="h-10 w-10 object-contain"
            />
            <div className="text-2xl font-black" style={{ color: '#1A2336' }}>
              GuruLink<span style={{ color: '#D4A34B' }}>.app</span>
            </div>
          </div>
          
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-2xl disabled:opacity-30 transition-all duration-200 disabled:cursor-not-allowed border shadow-sm"
            style={{ 
              color: '#1A2336',
              backgroundColor: '#FFFFFF',
              borderColor: '#E5E7EB',
              boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.08)'
            }}
            onClick={() => {
              const key = STEPS[step].key;
              if (key === 'promoCode') return setStep(STEPS.length);
              return next();
            }}
            disabled={isNextDisabled}
            aria-label="Next"
          >
            <span className="text-sm font-medium hidden sm:inline">Next</span>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Title Section */}
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3" style={{ color: '#1A2336' }}>
            {STEPS[step]?.title || 'Quest'}
          </h1>
          <ProgressBar progress={progress} />
        </div>

        {/* Step Content */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={STEPS[step].key}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="rounded-3xl shadow-2xl border p-8 sm:p-10"
              style={{ 
                backgroundColor: '#FFFFFF',
                borderColor: '#E5E7EB'
              }}
            >
              <QuizStep
                step={STEPS[step]}
                form={form}
                setForm={setForm}
                onAutoNext={() => setStep((s) => Math.min(s + 1, STEPS.length - 1))}
                isFromSignup={isFromSignup}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Continue Button Section */}
        {(() => {
          const key = STEPS[step].key;
          const continueKeys = new Set([
            'socialProof',
            'birth',
            'traitFeedback',
            'decisionFeedback1',
            'decisionFeedback2',
            'challengeFeedback',
            'lifeGoals',
            'portraitReady',
            'email',
          ]);
          // Hide external button for promoCode since it has its own Continue button
          if (key === 'promoCode') {
            return null;
          }
          if (continueKeys.has(key)) {
            return (
              <div className="mt-8 flex justify-center">
                <button className="btn px-8 py-3" onClick={() => next()} disabled={isNextDisabled}>
                  Continue
                </button>
              </div>
            );
          }
          if (key === 'preGenerationLanding') {
            return (
              <div className="mt-8 flex justify-center">
                <button className="btn px-8 py-3" onClick={() => next()} disabled={loading}>
                  Get Your Sketch
                </button>
              </div>
            );
          }
          return null;
        })()}
      </div>
    </div>
  );
}

function useJobPolling(job, setJob, setResult, setStep) {
  useEffect(() => {
    let timer;
    async function poll() {
      if (!job?.id) return;
      try {
        const s = await getJobStatus(job.id);
        setJob({ id: s.id, status: s.status, resultId: s.resultId || null });
        if (s.status === 'completed' && s.resultId) {
          const r = await getResult(s.resultId);
          setResult({ report: r.report, imageUrl: r.imageUrl, astrology: r.astrology, id: r.id });
          setStep((prev) => prev);
          return;
        }
      } catch {}
      timer = setTimeout(poll, 5000);
    }
    if (job?.id && typeof window !== 'undefined') {
      poll();
    }
    return () => clearTimeout(timer);
  }, [job?.id]);
}
