export default function ProgressBar({ progress = 0 }) {
  const percentage = Math.round(progress * 100);
  
  return (
    <div className="w-full space-y-2">
      {/* Progress bar with golden yellow */}
      <div className="relative h-3 w-full rounded-full overflow-hidden shadow-inner border" style={{ backgroundColor: '#E5E7EB', borderColor: '#E5E7EB' }}>
        <div
          className="h-full transition-all duration-500 ease-out relative overflow-hidden rounded-full"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: '#D4A34B'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse" />
        </div>
      </div>
      
      {/* Percentage indicator */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium" style={{ color: '#4B5563' }}>Progress</span>
        <span className="font-bold" style={{ color: '#D4A34B' }}>
          {percentage}%
        </span>
      </div>
    </div>
  );
}
