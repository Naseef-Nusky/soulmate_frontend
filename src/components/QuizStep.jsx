import React, { useEffect, useState } from 'react';
import { Smile, CheckCircle } from 'lucide-react';

function CheckboxGroup({ options, values, onChange }) {
  function toggle(val) {
    if (values.includes(val)) onChange(values.filter((v) => v !== val));
    else onChange([...values, val]);
  }
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2">
          <input type="checkbox" checked={values.includes(opt)} onChange={() => toggle(opt)} />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

function Modal({ open, icon, text, onSelect }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="rounded-xl shadow-xl w-[520px] max-w-[90%] p-6 space-y-4 border-2" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
        <div className="text-3xl text-center" style={{ color: '#D4A34B' }} aria-hidden>{icon}</div>
        <p className="text-center" style={{ color: '#4B5563' }}>{text}</p>
        <div className="grid grid-cols-2 gap-3">
          <button className="btn" onClick={() => onSelect(false)}>No</button>
          <button className="btn" onClick={() => onSelect(true)}>Yes</button>
        </div>
      </div>
    </div>
  );
}

function Warning({ open, onAcknowledge }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="rounded-xl shadow-xl w-[560px] max-w-[92%] p-6 space-y-4 border-2" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
        <h3 className="text-center font-bold text-xl" style={{ color: '#1A2336' }}>WARNING</h3>
        <p className="text-center" style={{ color: '#4B5563' }}>We have noticed something shocking while searching for your Soulmate. Prepare for surprising results!</p>
        <div className="flex justify-center">
          <button className="btn" onClick={onAcknowledge}>I Understand</button>
        </div>
      </div>
    </div>
  );
}

function Bar({ label, value }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm" style={{ color: '#1A2336' }}>
        <span>{label}</span>
        <span style={{ color: '#D4A34B' }}>{Math.round(value)}%</span>
      </div>
      <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: '#E5E7EB' }}>
        <div className="h-full" style={{ width: `${Math.min(100, value)}%`, backgroundColor: '#D4A34B' }} />
      </div>
    </div>
  );
}

function Preparing({ onDone }) {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [stage, setStage] = useState(0); // 0->bar1, 1->bar2, 2->bar3, 3->done
  const [m1, setM1] = useState(false);
  const [m2, setM2] = useState(false);
  const [warn, setWarn] = useState(false);

  // Drive progress sequentially per stage
  useEffect(() => {
    let id;
    if (stage === 0) {
      id = setInterval(() => {
        setA((v) => {
          const nv = Math.min(100, v + 4);
          if (nv >= 100) {
            clearInterval(id);
            setTimeout(() => setM1(true), 150);
          }
          return nv;
        });
      }, 60);
    } else if (stage === 1) {
      id = setInterval(() => {
        setB((v) => {
          const nv = Math.min(100, v + 3);
          if (nv >= 100) {
            clearInterval(id);
            setTimeout(() => setM2(true), 150);
          }
          return nv;
        });
      }, 60);
    } else if (stage === 2) {
      id = setInterval(() => {
        setC((v) => {
          const nv = Math.min(100, v + 2.5);
          if (nv >= 100) {
            clearInterval(id);
            setTimeout(() => setWarn(true), 150);
          }
          return nv;
        });
      }, 60);
    } else if (stage === 3) {
      const t = setTimeout(() => onDone && onDone(), 300);
      return () => clearTimeout(t);
    }
    return () => clearInterval(id);
  }, [stage, onDone]);

  const closeM1 = (answer) => { setM1(false); setStage(1); };
  const closeM2 = (answer) => { setM2(false); setStage(2); };
  const ackWarn = () => { setWarn(false); setStage(3); };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold" style={{ color: '#D4A34B' }}>Preparing Your Personal Soulmate Insights</h2>
      <Bar label="Heart’s Intentions" value={a} />
      <Bar label="Portrait of the Soulmate" value={b} />
      <Bar label="Connection Insights" value={c} />
      <Modal open={m1} icon="✨" text="Do you consider yourself a spiritual person?" onSelect={closeM1} />
      <Modal open={m2} icon="✨" text="Are you familiar with the concept of Psychic Artistry?" onSelect={closeM2} />
      <Warning open={warn} onAcknowledge={ackWarn} />
    </div>
  );
}

export default function QuizStep({ step, form, setForm, onAutoNext }) {
  const key = step.key;

  if (key === 'intro') {
    return (
       <div className="space-y-4 text-center">
        {/* Hero Image with gold gradient overlay */}
        <div className="relative mx-auto max-w-lg">
          <div className="relative rounded-2xl overflow-hidden shadow-xl border-2" style={{ borderColor: '#E5E7EB' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent z-10" />
          <img
              src="soulmatePortrait2.png"
            alt="Soulmate introduction"
              className="w-full h-48 sm:h-56 object-cover"
          />
          </div>
        </div>

        {/* Stats Cards with gold theme - reduced size */}
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          <div className="rounded-2xl p-3 shadow-lg transform hover:scale-105 transition-all duration-300 border-2" style={{ backgroundColor: '#D4A34B', color: '#1A2336', borderColor: '#D4A34B' }}>
            <div className="text-2xl font-black mb-0.5">87.3%</div>
            <div className="text-[10px] font-bold opacity-90 leading-tight">Say it felt Familiar</div>
          </div>
          <div className="rounded-2xl p-3 shadow-lg transform hover:scale-105 transition-all duration-300 border-2" style={{ backgroundColor: '#D4A34B', color: '#1A2336', borderColor: '#D4A34B' }}>
            <div className="text-2xl font-black mb-0.5">172K+</div>
            <div className="text-[10px] font-bold opacity-90 leading-tight">Happy Customers</div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <button className="btn text-base px-6 py-3 font-black" onClick={() => onAutoNext && onAutoNext()}>
            Begin Your Journey ✨
          </button>
        </div>
        
        {/* Legal Text - reduced spacing */}
        <div className="pt-2 space-y-1">
          <p className="text-[10px] leading-tight" style={{ color: 'rgba(212, 163, 75, 0.7)' }}>
            By continuing, you agree to our <a className="underline transition-colors font-semibold hover:opacity-80" href="#" onClick={(e) => e.preventDefault()} style={{ color: '#D4A34B' }}>Terms & Conditions</a> and <a className="underline transition-colors font-semibold hover:opacity-80" href="#" onClick={(e) => e.preventDefault()} style={{ color: '#D4A34B' }}>Privacy Notice</a>. 
            Have a question? <a className="underline transition-colors font-semibold hover:opacity-80" href="#" onClick={(e) => e.preventDefault()} style={{ color: '#D4A34B' }}>Reach our support team here</a>.
          </p>
          <p className="text-[10px] font-medium" style={{ color: 'rgba(212, 163, 75, 0.6)' }}>For entertainment purposes only.</p>
        </div>
      </div>
    );
  }

  if (key === 'socialProof') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black" style={{ color: '#1A2336' }}>
            Over 25 Million people have already met their Soulmate
          </h2>
          <p style={{ color: '#4B5563' }}>Join thousands each day uncovering the face of their true connection 💞</p>
        </div>
        
        {/* Testimonial Card */}
        <div className="rounded-3xl p-6 border-2 shadow-xl" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="text-sm font-semibold" style={{ color: '#1A2336' }}>Rebecca Bauman</div>
                <div className="text-xs" style={{ color: '#666' }}>March 5, 2025</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>
              I can’t believe how accurate it was! The sketch matched him perfectly — and now we’re together. This experience gave me hope and helped me open my heart again.
            </p>
            <div className="flex gap-1" aria-label="5 out of 5 stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-lg">⭐</span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-3xl p-5 border-2 shadow-md hover:shadow-lg transition-all duration-300" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
            <div className="text-2xl font-black mb-1" style={{ color: '#D4A34B' }}>900+</div>
            <div className="text-sm" style={{ color: '#4B5563' }}>people discovered their soulmate today</div>
          </div>
          <div className="rounded-3xl p-5 border-2 shadow-md hover:shadow-lg transition-all duration-300" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
            <div className="text-2xl font-black mb-1" style={{ color: '#D4A34B' }}>25M+</div>
            <div className="text-sm" style={{ color: '#4B5563' }}>people trust GuruLink worldwide</div>
          </div>
        </div>
        
        <div className="text-center pt-2">
          <p className="text-sm font-semibold" style={{ color: '#D4A34B' }}>Your soulmate could be waiting — start your journey below</p>
        </div>
      </div>
    );
  }

  if (key === 'gender1' || key === 'gender2') {
    const field = key === 'gender1' ? 'gender' : 'genderConfirm';
    const isConfirm = key === 'gender2';
    const options = [ { label: 'Male', img: '/MaleAvatar.png' }, { label: 'Female', img: '/FemaleAvatar.png' } ];
    return (
      <div className="space-y-4">
        <h3 className="text-base font-bold mb-4" style={{ color: '#D4A34B' }}>{isConfirm ? 'Who are you interested in?' : 'Select your gender'}</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          {options.map((opt) => (
            isConfirm ? (
              <button
                key={opt.label}
                type="button"
                className={`w-full py-4 rounded-2xl border-2 text-sm font-bold transition-all duration-300 ${form[field] === opt.label ? 'scale-[1.02]' : ''}`}
                style={form[field] === opt.label ? {
                  backgroundColor: '#D4A34B',
                  color: '#1A2336',
                  borderColor: '#D4A34B',
                  boxShadow: '0 10px 15px -3px rgba(212, 163, 75, 0.5)'
                } : {
                  backgroundColor: '#F8FAFC',
                  color: '#1A2336',
                  borderColor: '#E5E7EB'
                }}
                onMouseEnter={(e) => {
                  if (form[field] !== opt.label) {
                    e.currentTarget.style.borderColor = '#D4A34B';
                    e.currentTarget.style.backgroundColor = '#FFF7EB';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(212, 163, 75, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (form[field] !== opt.label) {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
                onClick={() => { setForm({ ...form, [field]: opt.label }); onAutoNext && onAutoNext(); }}
              >
                {opt.label}
              </button>
            ) : (
              <button
                key={opt.label}
                type="button"
                className={`w-full rounded-3xl border-2 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${form[field] === opt.label ? 'scale-[1.02] ring-4' : ''}`}
                style={form[field] === opt.label ? {
                  ringColor: 'rgba(212, 163, 75, 0.5)',
                  borderColor: '#D4A34B',
                  boxShadow: '0 20px 25px -5px rgba(212, 163, 75, 0.4)',
                  backgroundColor: '#FFF7EB'
                } : {
                  borderColor: '#E5E7EB',
                  backgroundColor: '#F1F5F9'
                }}
                onMouseEnter={(e) => {
                  if (form[field] !== opt.label) {
                    e.currentTarget.style.borderColor = '#D4A34B';
                  }
                }}
                onMouseLeave={(e) => {
                  if (form[field] !== opt.label) {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }
                }}
                onClick={() => { setForm({ ...form, [field]: opt.label }); onAutoNext && onAutoNext(); }}
              >
                <div className="flex flex-col items-stretch gap-3">
                  <img
                    src={opt.img}
                    alt={`${opt.label} avatar`}
                    className="w-full h-24 sm:h-40 md:h-56 object-cover"
                    onError={(e) => { e.currentTarget.src = 'https://api.dicebear.com/7.x/adventurer/png?seed=avatar&size=256'; }}
                  />
                  <div className="text-sm font-bold text-center pb-4" style={{ color: '#1A2336' }}>{opt.label}</div>
                </div>
              </button>
            )
          ))}
        </div>
      </div>
    );
  }

  if (key === 'ageRange') {
    const options = [
      { label: '20-30', emoji: '🧑' },
      { label: '30-40', emoji: '🧑‍🦰' },
      { label: '40-50', emoji: '🧔' },
      { label: '50+', emoji: '👴' },
    ];
    return (
      <div className="space-y-4">
        <h3 className="text-base font-bold mb-4" style={{ color: '#D4A34B' }}>Ideal age range for your soulmate?</h3>
        <div className="grid grid-cols-2 gap-3">
          {options.map((o) => (
            <button
              key={o.label}
              type="button"
              className={`w-full py-4 rounded-2xl border-2 text-sm font-bold transition-all duration-300 ${form.ageRange === o.label ? 'scale-[1.02]' : ''}`}
              style={form.ageRange === o.label ? {
                backgroundColor: '#D4A34B',
                color: '#1A2336',
                borderColor: '#D4A34B',
                boxShadow: '0 10px 15px -3px rgba(212, 163, 75, 0.5)'
              } : {
                backgroundColor: '#F8FAFC',
                color: '#1A2336',
                borderColor: '#E5E7EB'
              }}
              onMouseEnter={(e) => {
                if (form.ageRange !== o.label) {
                  e.currentTarget.style.borderColor = '#D4A34B';
                  e.currentTarget.style.backgroundColor = '#FFF7EB';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(212, 163, 75, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (form.ageRange !== o.label) {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              onClick={() => { setForm({ ...form, ageRange: o.label }); onAutoNext && onAutoNext(); }}
            >
              <span className="mr-2" aria-hidden>{o.emoji}</span>{o.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (key === 'ethnicity') {
    const options = [
      { label: 'Caucasian/White', emoji: '🧒', img: '/ethnicity/caucasian.png' },
      { label: 'Hispanic/Latino', emoji: '🧑‍🦱', img: '/ethnicity/latino.png' },
      { label: 'African/African-American', emoji: '🧑🏿', img: '/ethnicity/african.png' },
      { label: 'Asian', emoji: '🧑🏻', img: '/ethnicity/asian.png' },
      { label: 'No preference', emoji: '🫥', img: '/ethnicity/any.png' },
    ];
    return (
      <div className="space-y-4">
        <h3 className="text-base font-bold mb-4" style={{ color: '#D4A34B' }}>Do you have a preferred ethnic background for your sketch?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((o) => (
            <button
              key={o.label}
              type="button"
              className={`w-full py-4 rounded-2xl border-2 text-sm font-bold transition-all duration-300 ${form.ethnicity === o.label ? 'scale-[1.02]' : ''}`}
              style={form.ethnicity === o.label ? {
                backgroundColor: '#D4A34B',
                color: '#1A2336',
                borderColor: '#D4A34B',
                boxShadow: '0 10px 15px -3px rgba(212, 163, 75, 0.5)'
              } : {
                backgroundColor: '#F8FAFC',
                color: '#1A2336',
                borderColor: '#E5E7EB'
              }}
              onMouseEnter={(e) => {
                if (form.ethnicity !== o.label) {
                  e.currentTarget.style.borderColor = '#D4A34B';
                  e.currentTarget.style.backgroundColor = '#FFF7EB';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(212, 163, 75, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (form.ethnicity !== o.label) {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              onClick={() => { setForm({ ...form, ethnicity: o.label }); onAutoNext && onAutoNext(); }}
            >
              {o.label === 'No preference' ? (
                <Smile size={20} className="inline-block mr-2 align-middle text-yellow-600" />
              ) : o.img ? (
                <img
                  src={o.img}
                  alt=""
                  className="inline-block h-6 w-6 rounded-full mr-2 object-cover align-middle"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : null}
              <span className="mr-2" aria-hidden>{o.emoji}</span>{o.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (key === 'appearanceImportance') {
    const options = [
      { label: 'Not important', emoji: '👎' },
      { label: 'Somewhat unimportant', emoji: '👎' },
      { label: 'Neutral', emoji: '🤷' },
      { label: 'Important', emoji: '👍' },
      { label: 'Very important', emoji: '👍' },
    ];
    return (
      <div className="space-y-2">
        <label className="label">How important is a soulmate's appearance to you?</label>
        <div className="grid grid-cols-5 gap-2">
          {options.map((o, idx) => (
            <button
              key={o.label}
              type="button"
              aria-label={o.label}
              title={o.label}
              className={`w-full py-4 rounded-2xl border-2 text-xl transition-all duration-300 ${form.appearanceImportance === o.label ? 'scale-[1.02]' : ''}`}
              style={form.appearanceImportance === o.label ? {
                backgroundColor: '#D4A34B',
                color: '#1A2336',
                borderColor: '#D4A34B',
                boxShadow: '0 10px 15px -3px rgba(212, 163, 75, 0.5)'
              } : {
                backgroundColor: '#F8FAFC',
                color: '#1A2336',
                borderColor: '#E5E7EB'
              }}
              onMouseEnter={(e) => {
                if (form.appearanceImportance !== o.label) {
                  e.currentTarget.style.borderColor = '#D4A34B';
                  e.currentTarget.style.backgroundColor = '#FFF7EB';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(212, 163, 75, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (form.appearanceImportance !== o.label) {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              onClick={() => { setForm({ ...form, appearanceImportance: o.label }); onAutoNext && onAutoNext(); }}
            >
              <span
                className={`${(idx === 0 || idx === options.length - 1) ? 'text-3xl' : 'text-2xl'}`}
                aria-hidden
              >
                {o.emoji}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (key === 'keyTrait') {
    const options = [
      { label: 'Kindness', emoji: '😇', img: '/traits/kindness.png' },
      { label: 'Loyalty', emoji: '✅', img: '/traits/loyalty.png' },
      { label: 'Intelligence', emoji: '🧠', img: '/traits/intelligence.png' },
      { label: 'Creativity', emoji: '🤩', img: '/traits/creativity.png' },
      { label: 'Passion', emoji: '🔥', img: '/traits/passion.png' },
      { label: 'Empathy', emoji: '😊', img: '/traits/empathy.png' },
    ];
    function toggle(label) {
      // single-select: always keep only the chosen label
      setForm({ ...form, keyTraits: [label] });
      onAutoNext && onAutoNext();
    }
    return (
      <div className="space-y-2">
        <label className="label">What’s the key trait your soulmate should have?</label>
        <div className="space-y-3">
          {options.map((o) => {
            const selected = form.keyTraits.includes(o.label);
            return (
              <button
                key={o.label}
                type="button"
                onClick={() => toggle(o.label)}
                className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-300`}
                style={selected ? {
                  background: 'linear-gradient(to right, rgba(212, 163, 75, 0.2), rgba(212, 163, 75, 0.2))',
                  borderColor: '#D4A34B',
                  boxShadow: '0 10px 15px -3px rgba(212, 163, 75, 0.3)'
                } : {
                  backgroundColor: '#F8FAFC',
                  color: '#1A2336',
                  borderColor: '#E5E7EB'
                }}
                onMouseEnter={(e) => {
                  if (!selected) {
                    e.currentTarget.style.borderColor = '#D4A34B';
                    e.currentTarget.style.backgroundColor = '#FFF7EB';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(212, 163, 75, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selected) {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {o.img ? (
                  <img
                    src={o.img}
                    alt=""
                    className="h-9 w-9 rounded-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : null}
                <span className="text-xl" aria-hidden>{o.emoji}</span>
                <span className="flex-1 text-sm font-medium" style={{ color: '#1A2336' }}>{o.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (key === 'traitFeedback') {
    return (
      <div className="space-y-2" style={{ color: '#1A2336' }}>
        <p>Choosing qualities like <strong>{form.keyTraits.join(', ') || '—'}</strong> suggests you value depth and mutual respect. Great matches often share or complement these traits.</p>
      </div>
    );
  }

  if (key === 'birth') {
    return (
      <div className="space-y-4">
        <p className="text-sm" style={{ color: 'rgba(212, 163, 75, 0.7)' }}>It helps us create your natal chart and identify key planetary positions.</p>
        <div>
          <label className="label">Birth date</label>
          <input
            type="date"
            className="w-full px-4 py-3 rounded-xl border text-sm"
            value={form.birthDate}
            onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
            style={{
              backgroundColor: '#F8FAFC',
              borderColor: '#E5E7EB',
              color: '#1A2336'
            }}
          />
        </div>
      </div>
    );
  }

  if (key === 'element') {
    const options = [
      { label: 'Fire', emoji: '🔥' },
      { label: 'Water', emoji: '🌊' },
      { label: 'Earth', emoji: '🌍' },
      { label: 'Wind', emoji: '💨' },
    ];
    return (
      <div className="space-y-2">
        <label className="label">Which element matches you?</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((o) => (
            <button
              key={o.label}
              type="button"
              className={`w-full py-4 rounded-2xl border-2 text-sm font-bold transition-all duration-300 ${form.element === o.label ? 'scale-[1.02]' : ''}`}
              style={form.element === o.label ? {
                backgroundColor: '#D4A34B',
                color: '#1A2336',
                borderColor: '#D4A34B',
                boxShadow: '0 10px 15px -3px rgba(212, 163, 75, 0.5)'
              } : {
                backgroundColor: '#F8FAFC',
                color: '#1A2336',
                borderColor: '#E5E7EB'
              }}
              onMouseEnter={(e) => {
                if (form.element !== o.label) {
                  e.currentTarget.style.borderColor = '#D4A34B';
                  e.currentTarget.style.backgroundColor = '#FFF7EB';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(212, 163, 75, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (form.element !== o.label) {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              onClick={() => { setForm({ ...form, element: o.label }); onAutoNext && onAutoNext(); }}
            >
              <span className="mr-2" aria-hidden>{o.emoji}</span>{o.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (key === 'decisionMaking') {
    const options = [
      { label: 'Heart', emoji: '❤️' },
      { label: 'Head', emoji: '🧠' },
      { label: 'Both', emoji: '⚖️' },
    ];
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {options.map((o) => (
            <button
              key={o.label}
              type="button"
              className={`w-full py-4 rounded-2xl border-2 text-sm font-bold transition-all duration-300 ${form.decisionMaking === o.label ? 'scale-[1.02]' : ''}`}
              style={form.decisionMaking === o.label ? {
                backgroundColor: '#D4A34B',
                color: '#1A2336',
                borderColor: '#D4A34B',
                boxShadow: '0 10px 15px -3px rgba(212, 163, 75, 0.5)'
              } : {
                backgroundColor: '#F8FAFC',
                color: '#1A2336',
                borderColor: '#E5E7EB'
              }}
              onMouseEnter={(e) => {
                if (form.decisionMaking !== o.label) {
                  e.currentTarget.style.borderColor = '#D4A34B';
                  e.currentTarget.style.backgroundColor = '#FFF7EB';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(212, 163, 75, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (form.decisionMaking !== o.label) {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              onClick={() => { setForm({ ...form, decisionMaking: o.label }); onAutoNext && onAutoNext(); }}
            >
              <span className="mr-2" aria-hidden>{o.emoji}</span>{o.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (key === 'decisionFeedback1' || key === 'decisionFeedback2') {
    const choice = form.decisionMaking;
    let stat = '';
    if (choice === 'Heart') stat = '38% of Virgo Sun people also make decisions using their heart.';
    else if (choice === 'Head') stat = '40% of Virgo Sun people also make decisions using their head.';
    else if (choice === 'Both') stat = 'only the top 22% of Virgo Sun people make decisions using their heart and head.';
    return (
      <div className="space-y-2" style={{ color: '#1A2336' }}>
        <p className="font-medium">Good to know!</p>
        <p>Based on our data, {stat || 'many people share your approach to decision-making.'}</p>
        <p>Stay true to your core values; the right person resonates with your rhythm.</p>
      </div>
    );
  }

  if (key === 'challenge') {
    const options = [
      { label: 'Building trust', emoji: '🤝', img: '/challenge/trust.png' },
      { label: 'Finding the right person', emoji: '💑', img: '/challenge/right-person.png' },
      { label: 'Keeping the spark alive', emoji: '🔥', img: '/challenge/spark.png' },
      { label: 'Understanding my needs', emoji: '🧘', img: '/challenge/needs.png' },
      { label: 'Letting go of the past', emoji: '🌈', img: '/challenge/past.png' },
      { label: 'Dealing with uncertainty', emoji: '🌤️', img: '/challenge/uncertainty.png' },
    ];
    return (
      <div className="space-y-2">
        <h3 className="text-base font-bold mb-4" style={{ color: '#D4A34B' }}>What's your biggest personal challenge?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((o) => (
            <button
              key={o.label}
              type="button"
              className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-300`}
              style={form.challenge === o.label ? {
                background: 'linear-gradient(to right, rgba(212, 163, 75, 0.2), rgba(212, 163, 75, 0.2))',
                borderColor: '#D4A34B',
                boxShadow: '0 10px 15px -3px rgba(212, 163, 75, 0.3)'
              } : {
                backgroundColor: '#F8FAFC',
                color: '#1A2336',
                borderColor: '#E5E7EB'
              }}
              onMouseEnter={(e) => {
                if (form.challenge !== o.label) {
                  e.currentTarget.style.borderColor = '#D4A34B';
                  e.currentTarget.style.backgroundColor = '#FFF7EB';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(212, 163, 75, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (form.challenge !== o.label) {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              onClick={() => { setForm({ ...form, challenge: o.label }); onAutoNext && onAutoNext(); }}
            >
              {o.img ? (
                <img
                  src={o.img}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : null}
              <span className="text-xl" aria-hidden>{o.emoji}</span>
              <span className="flex-1 text-sm font-medium" style={{ color: '#1A2336' }}>{o.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (key === 'challengeFeedback') {
    return (
      <div style={{ color: '#1A2336' }}>
        <p>Working through “{form.challenge || '—'}” strengthens resilience and attracts a partner who meets you with care.</p>
      </div>
    );
  }

  if (key === 'redFlag') {
    const options = [
      { label: 'Lack of trust', emoji: '😕' },
      { label: 'Poor communication', emoji: '🗣️' },
      { label: 'Jealousy', emoji: '😒' },
      { label: 'Disrespect', emoji: '😠' },
      { label: 'Inconsistency', emoji: '🔄' },
      { label: 'Self-centeredness', emoji: '😎' },
    ];
    return (
      <div className="space-y-2">
        <h3 className="text-base font-bold mb-4" style={{ color: '#D4A34B' }}>What is your biggest red flag?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((o) => (
            <button
              key={o.label}
              type="button"
              className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-300`}
              style={form.redFlag === o.label ? {
                background: 'linear-gradient(to right, rgba(212, 163, 75, 0.2), rgba(212, 163, 75, 0.2))',
                borderColor: '#D4A34B',
                boxShadow: '0 10px 15px -3px rgba(212, 163, 75, 0.3)'
              } : {
                backgroundColor: '#F8FAFC',
                color: '#1A2336',
                borderColor: '#E5E7EB'
              }}
              onMouseEnter={(e) => {
                if (form.redFlag !== o.label) {
                  e.currentTarget.style.borderColor = '#D4A34B';
                  e.currentTarget.style.backgroundColor = '#FFF7EB';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(212, 163, 75, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (form.redFlag !== o.label) {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              onClick={() => { setForm({ ...form, redFlag: o.label }); onAutoNext && onAutoNext(); }}
            >
              <span className="text-xl" aria-hidden>{o.emoji}</span>
              <span className="flex-1 text-sm font-medium" style={{ color: '#1A2336' }}>{o.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (key === 'partnerPreference') {
    const options = [
      { label: 'Similar to me', emoji: '😊' },
      { label: 'Brings contrast', emoji: '🤩' },
    ];
    return (
      <div className="space-y-2">
        <h3 className="text-base font-bold mb-4" style={{ color: '#D4A34B' }}>Do you prefer a similar partner or one who contrasts with you?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((o) => (
            <button
              key={o.label}
              type="button"
              className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-300`}
              style={form.partnerPreference === o.label ? {
                background: 'linear-gradient(to right, rgba(212, 163, 75, 0.2), rgba(212, 163, 75, 0.2))',
                borderColor: '#D4A34B',
                boxShadow: '0 10px 15px -3px rgba(212, 163, 75, 0.3)'
              } : {
                backgroundColor: '#F8FAFC',
                color: '#1A2336',
                borderColor: '#E5E7EB'
              }}
              onMouseEnter={(e) => {
                if (form.partnerPreference !== o.label) {
                  e.currentTarget.style.borderColor = '#D4A34B';
                  e.currentTarget.style.backgroundColor = '#FFF7EB';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(212, 163, 75, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (form.partnerPreference !== o.label) {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              onClick={() => { setForm({ ...form, partnerPreference: o.label }); onAutoNext && onAutoNext(); }}
            >
              <span className="text-xl" aria-hidden>{o.emoji}</span>
              <span className="flex-1 text-sm font-medium" style={{ color: '#1A2336' }}>{o.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (key === 'relationshipDynamic') {
    const options = [
      { label: 'Partnership', emoji: '💕' },
      { label: 'Friendship', emoji: '❤️' },
      { label: 'Adventure', emoji: '⛵' },
      { label: 'Deep connection', emoji: '💖' },
      { label: 'Balanced growth', emoji: '🎯' },
    ];
    return (
      <div className="space-y-2">
        <h3 className="text-base font-bold mb-4" style={{ color: '#D4A34B' }}>What's your ideal relationship dynamic?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((o) => (
            <button
              key={o.label}
              type="button"
              className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-300`}
              style={form.relationshipDynamic === o.label ? {
                background: 'linear-gradient(to right, rgba(212, 163, 75, 0.2), rgba(212, 163, 75, 0.2))',
                borderColor: '#D4A34B',
                boxShadow: '0 10px 15px -3px rgba(212, 163, 75, 0.3)'
              } : {
                backgroundColor: '#F8FAFC',
                color: '#1A2336',
                borderColor: '#E5E7EB'
              }}
              onMouseEnter={(e) => {
                if (form.relationshipDynamic !== o.label) {
                  e.currentTarget.style.borderColor = '#D4A34B';
                  e.currentTarget.style.backgroundColor = '#FFF7EB';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(212, 163, 75, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (form.relationshipDynamic !== o.label) {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              onClick={() => { setForm({ ...form, relationshipDynamic: o.label }); onAutoNext && onAutoNext(); }}
            >
              <span className="text-xl" aria-hidden>{o.emoji}</span>
              <span className="flex-1 text-sm font-medium" style={{ color: '#1A2336' }}>{o.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (key === 'loveLanguage') {
    const options = [
      { label: 'Words of affirmation', emoji: '💝' },
      { label: 'Acts of service', emoji: '💕' },
      { label: 'Physical touch', emoji: '❤️' },
      { label: 'Receiving gifts', emoji: '🎁' },
      { label: 'Quality time', emoji: '⏳' },
    ];
    return (
      <div className="space-y-2">
        <h3 className="text-base font-bold mb-4" style={{ color: '#D4A34B' }}>What's your primary love language?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((o) => (
            <button
              key={o.label}
              type="button"
              className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-300`}
              style={form.loveLanguage === o.label ? {
                background: 'linear-gradient(to right, rgba(212, 163, 75, 0.2), rgba(212, 163, 75, 0.2))',
                borderColor: '#D4A34B',
                boxShadow: '0 10px 15px -3px rgba(212, 163, 75, 0.3)'
              } : {
                backgroundColor: '#F8FAFC',
                color: '#1A2336',
                borderColor: '#E5E7EB'
              }}
              onMouseEnter={(e) => {
                if (form.loveLanguage !== o.label) {
                  e.currentTarget.style.borderColor = '#D4A34B';
                  e.currentTarget.style.backgroundColor = '#FFF7EB';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(212, 163, 75, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (form.loveLanguage !== o.label) {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              onClick={() => { setForm({ ...form, loveLanguage: o.label }); onAutoNext && onAutoNext(); }}
            >
              <span className="text-xl" aria-hidden>{o.emoji}</span>
              <span className="flex-1 text-sm font-medium" style={{ color: '#1A2336' }}>{o.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (key === 'idealConnection') {
    const options = [
      { label: 'Deep and intimate', emoji: '💋' },
      { label: 'Fun and adventurous', emoji: '🎉' },
      { label: 'Balanced and supportive', emoji: '⚖️' },
      { label: 'Passionate and inspiring', emoji: '🙌' },
      { label: 'Calm and steady', emoji: '🧘' },
      { label: 'Full of growth and learning', emoji: '🧠' },
      { label: 'Other', emoji: '🤔' },
    ];
    return (
      <div className="space-y-2">
        <h3 className="text-base font-bold mb-4" style={{ color: '#D4A34B' }}>What's your ideal connection with a partner?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((o) => (
            <button
              key={o.label}
              type="button"
              className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-300`}
              style={form.idealConnection === o.label ? {
                background: 'linear-gradient(to right, rgba(212, 163, 75, 0.2), rgba(212, 163, 75, 0.2))',
                borderColor: '#D4A34B',
                boxShadow: '0 10px 15px -3px rgba(212, 163, 75, 0.3)'
              } : {
                backgroundColor: '#F8FAFC',
                color: '#1A2336',
                borderColor: '#E5E7EB'
              }}
              onMouseEnter={(e) => {
                if (form.idealConnection !== o.label) {
                  e.currentTarget.style.borderColor = '#D4A34B';
                  e.currentTarget.style.backgroundColor = '#FFF7EB';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(212, 163, 75, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (form.idealConnection !== o.label) {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              onClick={() => { setForm({ ...form, idealConnection: o.label }); onAutoNext && onAutoNext(); }}
            >
              <span className="text-xl" aria-hidden>{o.emoji}</span>
              <span className="flex-1 text-sm" style={{ color: '#1A2336' }}>{o.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (key === 'relationshipFear') {
    const options = [
      { label: 'Losing trust', emoji: '💔' },
      { label: 'Growing apart', emoji: '🧍‍♂️↔️🧍‍♀️' },
      { label: 'Not being understood', emoji: '🤷' },
      { label: 'Lack of commitment', emoji: '🙅' },
      { label: 'Being vulnerable', emoji: '🫣' },
      { label: 'Getting hurt again', emoji: '😢' },
      { label: 'Other', emoji: '❓' },
    ];
    return (
      <div className="space-y-2">
        <h3 className="text-base font-bold mb-4" style={{ color: '#D4A34B' }}>What's your biggest relationship fear? <span aria-hidden>🫣</span></h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((o) => (
            <button
              key={o.label}
              type="button"
              className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-300`}
              style={form.relationshipFear === o.label ? {
                background: 'linear-gradient(to right, rgba(212, 163, 75, 0.2), rgba(212, 163, 75, 0.2))',
                borderColor: '#D4A34B',
                boxShadow: '0 10px 15px -3px rgba(212, 163, 75, 0.3)'
              } : {
                backgroundColor: '#F8FAFC',
                color: '#1A2336',
                borderColor: '#E5E7EB'
              }}
              onMouseEnter={(e) => {
                if (form.relationshipFear !== o.label) {
                  e.currentTarget.style.borderColor = '#D4A34B';
                  e.currentTarget.style.backgroundColor = '#FFF7EB';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(212, 163, 75, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (form.relationshipFear !== o.label) {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              onClick={() => { setForm({ ...form, relationshipFear: o.label }); onAutoNext && onAutoNext(); }}
            >
              <span className={`${o.label === 'Being vulnerable' ? 'text-2xl' : 'text-xl'}`} aria-hidden>{o.emoji}</span>
              <span className="flex-1 text-sm font-medium" style={{ color: '#1A2336' }}>{o.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (key === 'lifeGoals') {
    const options = [
      { label: 'Building a family', emoji: '👨‍👩‍👧‍👦' },
      { label: 'Traveling the world', emoji: '✈️' },
      { label: 'Creating a business', emoji: '💼' },
      { label: 'Personal growth', emoji: '🚀' },
      { label: 'Financial stability', emoji: '💵' },
      { label: 'Making a positive impact', emoji: '🎯' },
      { label: 'Other', emoji: '🙂' },
    ];

    function toggle(label) {
      const exists = form.lifeGoals.includes(label);
      const next = exists ? form.lifeGoals.filter((t) => t !== label) : [...form.lifeGoals, label];
      setForm({ ...form, lifeGoals: next });
    }

    return (
      <div className="space-y-2">
        <h3 className="text-base font-bold mb-4" style={{ color: '#D4A34B' }}>What life goals do you hope to achieve with your soulmate?</h3>
        <div className="space-y-3">
          {options.map((o) => {
            const selected = form.lifeGoals.includes(o.label);
            return (
              <button
                key={o.label}
                type="button"
                onClick={() => toggle(o.label)}
                className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-300`}
                style={selected ? {
                  background: 'linear-gradient(to right, rgba(212, 163, 75, 0.2), rgba(212, 163, 75, 0.2))',
                  borderColor: '#D4A34B',
                  boxShadow: '0 10px 15px -3px rgba(212, 163, 75, 0.3)'
                } : {
                  backgroundColor: '#F8FAFC',
                  color: '#1A2336',
                  borderColor: '#E5E7EB'
                }}
                onMouseEnter={(e) => {
                  if (!selected) {
                    e.currentTarget.style.borderColor = '#D4A34B';
                    e.currentTarget.style.backgroundColor = '#FFF7EB';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(212, 163, 75, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selected) {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <span className="text-xl" aria-hidden>{o.emoji}</span>
                <span className="flex-1 text-sm font-medium" style={{ color: '#1A2336' }}>{o.label}</span>
                {selected ? (
                  <CheckCircle size={18} style={{ color: '#D4A34B' }} />
                ) : (
                  <span className="inline-block h-4 w-4 rounded border-2" style={{ borderColor: 'rgba(212, 163, 75, 0.5)' }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (key === 'preparing') {
    return <Preparing onDone={() => onAutoNext && onAutoNext()} />;
  }

  // Removed 'warning' step per request

  if (key === 'portraitReady') {
    return (
      <div className="space-y-2">
        <h2 className="text-xl font-bold" style={{ color: '#D4A34B' }}>Your soulmate portrait is ready!</h2>
        <p style={{ color: 'rgba(212, 163, 75, 0.8)' }}>Proceed to see your soulmate now.</p>
      </div>
    );
  }

  if (key === 'email') {
    return (
      <div className="space-y-2">
        <label className="label">Where should we send it?</label>
        <input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
    );
  }

  if (key === 'promoCode') {
    return (
      <div className="space-y-2">
        <p style={{ color: 'rgba(212, 163, 75, 0.8)' }}>Your one-time promo code:</p>
        <div className="text-2xl font-bold tracking-wide">GURULINK93</div>
      </div>
    );
  }

  return null;
}


