import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Clock3,
  Smartphone,
  ScrollText,
  Stars,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import QuizApp from '../App.jsx';

const highlightCards = [
  {
    icon: Sparkles,
    title: 'Personalized Flow',
    desc: 'Every answer adapts the next prompt so you only see questions that matter.',
  },
  {
    icon: ShieldCheck,
    title: 'Private & Secure',
    desc: 'Your insights and portrait are encrypted in transit and never sold.',
  },
  {
    icon: Clock3,
    title: '< 4 Minutes',
    desc: 'Designed for on-the-go mobile users. Average completion time is 3m 40s.',
  },
];

const microSteps = [
  'Share your vibe & preferences',
  'Unlock astrology-backed insights',
  'Preview your soulmate sketch plan',
];

const perks = [
  {
    icon: Stars,
    title: 'Astro-backed insights',
    desc: 'We fuse numerology, astrology, and behavioral data to guide your match.',
  },
  {
    icon: ScrollText,
    title: 'Actionable summary',
    desc: 'Receive a mobile-ready brief you can revisit anytime inside GuruLink.',
  },
  {
    icon: Smartphone,
    title: 'Mobile first',
    desc: 'Optimized tapping targets, haptics-ready interactions, and offline tolerance.',
  },
];

export default function QuizStartPage() {
  const [hasStarted, setHasStarted] = useState(false);
  const [hasAutoSave, setHasAutoSave] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasAutoSave(Boolean(localStorage.getItem('quizData')));
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const wantsAutoStart = params.get('start') === '1' || params.get('start') === 'true';

    if (wantsAutoStart) {
      setHasStarted(true);
    }
  }, [location.search]);

  if (hasStarted) {
    return <QuizApp />;
  }

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          'radial-gradient(circle at top, rgba(39, 76, 255, 0.25), rgba(10, 12, 24, 1) 55%)',
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10 shadow-2xl backdrop-blur-lg"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-white/70 mb-4">
            GuruLink Mobile
          </p>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            Your soulmate journey starts with three guided minutes.
          </h1>
          <p className="text-base sm:text-lg text-white/80 mb-8">
            Tap through curated prompts, unlock astro-personalized insights, and
            reserve your hand-drawn portrait. Built for Android/iOS — works
            offline between steps and auto-saves key answers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <button
              onClick={() => setHasStarted(true)}
              className="flex-1 rounded-2xl bg-gradient-to-r from-[#F5A524] via-[#FF6F61] to-[#B51EFF] px-6 py-4 text-lg font-semibold shadow-xl shadow-[#F5A524]/40 transition hover:scale-[1.01] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              Start Quiz
            </button>
            {hasAutoSave && (
              <button
                onClick={() => setHasStarted(true)}
                className="flex-1 rounded-2xl border border-white/20 px-6 py-4 text-lg font-semibold text-white/80 transition hover:border-white/60"
              >
                Resume Saved Progress
              </button>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Clock3 size={18} />
              <span>Avg time · 3m 40s</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} />
              <span>Encrypted responses</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} />
              <span>Instant feedback moments</span>
            </div>
          </div>
        </motion.section>

        <section className="grid gap-4 sm:grid-cols-3">
          {highlightCards.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
            >
              <Icon className="mb-3 h-6 w-6 text-[#F5A524]" />
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm text-white/75">{desc}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60 mb-4">
            What happens inside
          </p>
          <div className="grid gap-3">
            {microSteps.map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <div className="h-10 w-10 rounded-full bg-white/10 text-center leading-10 font-bold text-white/80">
                  {index + 1}
                </div>
                <p className="text-base text-white/85">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {perks.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-5 backdrop-blur"
            >
              <Icon className="mb-3 h-6 w-6 text-[#F5A524]" />
              <h4 className="font-semibold text-lg mb-2">{title}</h4>
              <p className="text-sm text-white/80">{desc}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

