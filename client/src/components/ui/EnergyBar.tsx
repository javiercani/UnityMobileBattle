interface EnergyBarProps {
  current: number;
  max: number;
  color: 'blue' | 'red' | 'green' | 'yellow';
  playerNumber: 1 | 2;
}

export default function EnergyBar({ current, max, color, playerNumber }: EnergyBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  
  const colorClasses = {
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500'
  };

  const glowColors = {
    blue: 'shadow-blue-400/50',
    red: 'shadow-red-400/50',
    green: 'shadow-green-400/50',
    yellow: 'shadow-yellow-400/50'
  };

  return (
    <div className="w-48 space-y-1">
      <div className="flex justify-between text-xs font-semibold">
        <span>ENERGY</span>
        <span>{Math.round(current)}/{max}</span>
      </div>
      
      <div className="relative">
        {/* Background bar */}
        <div className="w-full h-4 bg-gray-700 rounded-full border border-gray-600">
          {/* Energy fill */}
          <div
            className={`h-full rounded-full transition-all duration-300 ${colorClasses[color]} ${glowColors[color]} shadow-lg`}
            style={{ 
              width: `${percentage}%`,
              boxShadow: percentage > 0 ? `0 0 10px ${color === 'blue' ? '#60A5FA' : color === 'red' ? '#F87171' : color === 'green' ? '#4ADE80' : '#FBBF24'}` : 'none'
            }}
          />
          
          {/* Shine effect */}
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Warning indicators */}
        {percentage < 25 && (
          <div className="absolute -top-1 -right-1">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>
        )}
        
        {/* Segment markers */}
        <div className="absolute inset-0 flex justify-between items-center px-1">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="w-px h-2 bg-gray-800/50"
            />
          ))}
        </div>
      </div>

      {/* Critical energy warning */}
      {percentage < 15 && (
        <div className="text-xs text-red-400 font-bold animate-pulse text-center">
          CRITICAL!
        </div>
      )}
    </div>
  );
}
