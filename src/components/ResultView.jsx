import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendHoroscopeLoginEmail } from '../lib/api.js';

export default function ResultView({ result, onRestart, email }) {
  const navigate = useNavigate();
  const [sendingLoginLink, setSendingLoginLink] = useState(false);

  if (!result) {
    return (
      <div className="rounded-3xl shadow-2xl border p-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
        <p style={{ color: '#1A2336' }}>No result yet.</p>
        <button className="btn mt-4" onClick={onRestart}>Start Over</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl shadow-2xl border p-6 sm:p-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
        <h3 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#1A2336' }}>Hand‑Drawn Pencil Sketch</h3>
        {result.imageUrl ? (
          <div className="rounded-2xl overflow-hidden shadow-lg border" style={{ borderColor: '#E5E7EB' }}>
            <img src={result.imageUrl} alt="Soulmate pencil sketch" className="w-full object-contain" />
          </div>
        ) : (
          <p style={{ color: '#4B5563' }}>Image unavailable.</p>
        )}
      </div>
      
      {result.report && (
        <div className="rounded-3xl shadow-2xl border p-6 sm:p-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
          <h3 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#1A2336' }}>Your Soulmate Report</h3>
          <div className="prose max-w-none" style={{ color: '#4B5563' }}>
            <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{result.report}</div>
          </div>
        </div>
      )}
      
      {result.astrology && (
        <div className="rounded-3xl shadow-2xl border p-6 sm:p-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
          <h3 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#1A2336' }}>Astrological Insights</h3>
          <div className="space-y-2" style={{ color: '#4B5563' }}>
            {result.astrology.sunSign && (
              <p className="text-sm sm:text-base"><span className="font-semibold" style={{ color: '#D4A34B' }}>Sun Sign:</span> {result.astrology.sunSign}</p>
            )}
            {result.astrology.element && (
              <p className="text-sm sm:text-base"><span className="font-semibold" style={{ color: '#D4A34B' }}>Element:</span> {result.astrology.element}</p>
            )}
          </div>
        </div>
      )}


      {/* Compatibility Reading */}
      <div className="rounded-3xl shadow-2xl border p-6 sm:p-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
        <h3 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#1A2336' }}>Compatibility Reading</h3>
        <div className="prose max-w-none" style={{ color: '#4B5563' }}>
          <p className="text-sm sm:text-base leading-relaxed">
            Your compatibility analysis reveals a strong potential for deep, transformative relationships. Based on your {result.astrology?.sunSign || 'astrological'} profile and the traits you've indicated, your ideal partner will complement your {result.astrology?.element || 'elemental'} nature, creating a harmonious balance that supports both personal growth and mutual understanding.
          </p>
          <p className="text-sm sm:text-base leading-relaxed mt-4">
            The alignment between your birth chart and your partner's energy signature suggests a connection that transcends the ordinary. This compatibility reading indicates that when you meet your destined partner, you'll experience an immediate sense of recognition and deep resonance, as if your souls have been preparing for this meeting across lifetimes.
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <button 
          className="btn px-8 py-3 text-base font-bold" 
          onClick={async () => {
            if (email) {
              try {
                setSendingLoginLink(true);
                await sendHoroscopeLoginEmail(email);
              } catch (err) {
                console.error('Failed to send login link', err);
              } finally {
                setSendingLoginLink(false);
              }
            }
            const target = email ? `/login?generateHoroscope=true&email=${encodeURIComponent(email)}` : '/login?generateHoroscope=true';
            navigate(target);
          }}
          style={{
            backgroundColor: '#D4A34B',
            color: '#1A2336',
          }}
          disabled={sendingLoginLink}
        >
          {sendingLoginLink ? 'Sending login link...' : 'Login & Generate Horoscopes'}
        </button>

      </div>
    </div>
  );
}



