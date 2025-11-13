import { useMemo, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProgressBar from './components/ProgressBar.jsx';
import QuizStep from './components/QuizStep.jsx';
import ResultView from './components/ResultView.jsx';
import PreGenerationLanding from './components/PreGenerationLanding.jsx';
import { submitQuiz, requestGeneration, getJobStatus, getResult, sendSketchReadyEmail } from './lib/api.js';

const STEPS = [
  { key: 'intro', title: 'Ready to finally discover your True Soulmate?' },
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
  { key: 'preGenerationLanding', title: 'Get Your Sketch' },
  { key: 'promoCode', title: 'Your Promo Code' },
];

// Export as QuizApp for routing
export default function QuizApp() {
  const [step, setStep] = useState(0);
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

  // Reset form when returning to intro step
  useEffect(() => {
    if (step === 0) {
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
  }, [step]);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  async function onSubmit() {
    setLoading(true);
    setResult(null);
    setSubmittedEmail(form.email);
    try {
      const payload = {
        answers: { ...form },
        birthDetails: {
          date: form.birthDate,
          time: form.birthTime || null,
          city: form.birthCity || null,
        },
        email: form.email || null,
      };
      const res = await submitQuiz(payload);
      setResult(res);
      setJob({ id: null, status: null, resultId: null });
      setStep(STEPS.length);

      if (form.email) {
        try {
          await sendSketchReadyEmail(form.email);
        } catch (err) {
          console.error('Failed to send sketch email', err);
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
          if (continueKeys.has(key)) {
            return (
              <div className="mt-8 flex justify-center">
                <button className="btn px-8 py-3" onClick={() => next()} disabled={isNextDisabled}>
                  Continue
                </button>
              </div>
            );
          }
          if (key === 'promoCode') {
            return (
              <div className="mt-8 flex justify-center">
                <button className="btn px-8 py-3" onClick={() => setStep(STEPS.length)} disabled={loading}>
                  See Results
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
