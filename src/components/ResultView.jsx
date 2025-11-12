import { useNavigate } from 'react-router-dom';

export default function ResultView({ result, onRestart }) {
  const navigate = useNavigate();

  if (!result) {
    return (
      <div className="backdrop-blur-xl rounded-3xl shadow-2xl border p-8" style={{ backgroundColor: 'rgba(26, 35, 54, 0.9)', borderColor: 'rgba(212, 163, 75, 0.3)' }}>
        <p style={{ color: '#F5F5F5' }}>No result yet.</p>
        <button className="btn mt-4" onClick={onRestart}>Start Over</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="backdrop-blur-xl rounded-3xl shadow-2xl border p-6 sm:p-8" style={{ backgroundColor: 'rgba(26, 35, 54, 0.9)', borderColor: 'rgba(212, 163, 75, 0.3)' }}>
        <h3 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#D4A34B' }}>Hand‑Drawn Pencil Sketch</h3>
        {result.imageUrl ? (
          <div className="rounded-2xl overflow-hidden shadow-lg border-2" style={{ borderColor: 'rgba(212, 163, 75, 0.3)' }}>
            <img src={result.imageUrl} alt="Soulmate pencil sketch" className="w-full object-contain" />
          </div>
        ) : (
          <p style={{ color: '#F5F5F5' }}>Image unavailable.</p>
        )}
      </div>
      
      {result.report && (
        <div className="backdrop-blur-xl rounded-3xl shadow-2xl border p-6 sm:p-8" style={{ backgroundColor: 'rgba(26, 35, 54, 0.9)', borderColor: 'rgba(212, 163, 75, 0.3)' }}>
          <h3 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#D4A34B' }}>Your Soulmate Report</h3>
          <div className="prose prose-invert max-w-none" style={{ color: '#F5F5F5' }}>
            <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{result.report}</div>
          </div>
        </div>
      )}
      
      {result.astrology && (
        <div className="backdrop-blur-xl rounded-3xl shadow-2xl border p-6 sm:p-8" style={{ backgroundColor: 'rgba(26, 35, 54, 0.9)', borderColor: 'rgba(212, 163, 75, 0.3)' }}>
          <h3 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#D4A34B' }}>Astrological Insights</h3>
          <div className="space-y-2" style={{ color: '#F5F5F5' }}>
            {result.astrology.sunSign && (
              <p className="text-sm sm:text-base"><span className="font-semibold" style={{ color: '#D4A34B' }}>Sun Sign:</span> {result.astrology.sunSign}</p>
            )}
            {result.astrology.element && (
              <p className="text-sm sm:text-base"><span className="font-semibold" style={{ color: '#D4A34B' }}>Element:</span> {result.astrology.element}</p>
            )}
          </div>
        </div>
      )}

      {/* Palmistry Insights */}
      <div className="backdrop-blur-xl rounded-3xl shadow-2xl border p-6 sm:p-8" style={{ backgroundColor: 'rgba(26, 35, 54, 0.9)', borderColor: 'rgba(212, 163, 75, 0.3)' }}>
        <h3 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#D4A34B' }}>Palmistry Insights</h3>
        <div className="prose prose-invert max-w-none" style={{ color: '#F5F5F5' }}>
          <p className="text-sm sm:text-base leading-relaxed">
            Based on your astrological profile and life path indicators, your palmistry reading reveals strong intuitive abilities and a natural gift for understanding others. Your life line suggests a journey filled with meaningful connections, while your heart line indicates deep emotional capacity and the ability to form lasting bonds. The patterns in your palm align with your {result.astrology?.element || 'elemental'} nature, showing a harmonious balance between your inner desires and external expressions.
          </p>
          <p className="text-sm sm:text-base leading-relaxed mt-4">
            Your destiny line shows clear markers for transformative relationships that will significantly impact your life path. The intersection points suggest key moments where your soulmate connection will manifest, aligning with the cosmic timing revealed in your birth chart.
          </p>
        </div>
      </div>

      {/* Compatibility Reading */}
      <div className="backdrop-blur-xl rounded-3xl shadow-2xl border p-6 sm:p-8" style={{ backgroundColor: 'rgba(26, 35, 54, 0.9)', borderColor: 'rgba(212, 163, 75, 0.3)' }}>
        <h3 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#D4A34B' }}>Compatibility Reading</h3>
        <div className="prose prose-invert max-w-none" style={{ color: '#F5F5F5' }}>
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
          onClick={() => {
            // Redirect to dashboard with soulmate tab active
            navigate('/dashboard?tab=insight&showSoulmate=true');
          }}
          style={{
            backgroundColor: '#D4A34B',
            color: '#1A2336',
          }}
        >
          View in Dashboard & Generate Horoscopes
        </button>
    
      </div>
    </div>
  );
}



