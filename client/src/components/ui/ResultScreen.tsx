import { useFighting } from "../../lib/stores/useFighting";
import { useAudio } from "../../lib/stores/useAudio";
import { Button } from "./button";
import { Card } from "./card";

export default function ResultScreen() {
  const { 
    winner, 
    fighters,
    scores,
    resetGame,
    startCharacterSelection 
  } = useFighting();
  
  const { playSuccess } = useAudio();

  const winnerFighter = winner ? fighters[winner] : null;
  const loserFighter = winner ? fighters[winner === 1 ? 2 : 1] : null;

  // Play victory sound
  React.useEffect(() => {
    if (winner) {
      playSuccess();
    }
  }, [winner, playSuccess]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0">
        {winner && [...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
              fontSize: `${0.5 + Math.random() * 1}rem`
            }}
          >
            {Math.random() > 0.5 ? '🎉' : '⭐'}
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center space-y-8 p-4">
        {/* Main Result */}
        <div className="space-y-4">
          {winner ? (
            <>
              <h1 className="text-6xl md:text-8xl font-bold text-yellow-400 drop-shadow-lg animate-pulse">
                VICTORY!
              </h1>
              <div className="space-y-2">
                <div className="text-4xl">
                  {winnerFighter?.emoji}
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white">
                  {winnerFighter?.name} WINS!
                </h2>
                <p className="text-lg text-gray-300">
                  Fighting Style: {winnerFighter?.style}
                </p>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-6xl md:text-8xl font-bold text-gray-400 drop-shadow-lg">
                DRAW!
              </h1>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Time's Up!
              </h2>
            </>
          )}
        </div>

        {/* Battle Statistics */}
        <Card className="bg-black/70 backdrop-blur-sm border-2 border-yellow-400 p-6 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">Battle Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
            {/* Player 1 Stats */}
            <div className="text-center space-y-2">
              <div className="text-3xl">{fighters[1]?.emoji}</div>
              <h4 className="font-bold text-lg">{fighters[1]?.name}</h4>
              <div className="space-y-1 text-sm">
                <div>Energy Left: {Math.round(fighters[1]?.energy || 0)}</div>
                <div>Score: {scores[1] || 0}</div>
                {winner === 1 && (
                  <div className="text-yellow-400 font-bold">WINNER! 🏆</div>
                )}
              </div>
            </div>

            {/* VS */}
            <div className="flex items-center justify-center">
              <div className="text-4xl font-bold text-gray-400">VS</div>
            </div>

            {/* Player 2 Stats */}
            <div className="text-center space-y-2">
              <div className="text-3xl">{fighters[2]?.emoji}</div>
              <h4 className="font-bold text-lg">{fighters[2]?.name}</h4>
              <div className="space-y-1 text-sm">
                <div>Energy Left: {Math.round(fighters[2]?.energy || 0)}</div>
                <div>Score: {scores[2] || 0}</div>
                {winner === 2 && (
                  <div className="text-yellow-400 font-bold">WINNER! 🏆</div>
                )}
              </div>
            </div>
          </div>

          {/* Match Summary */}
          <div className="mt-6 pt-4 border-t border-gray-600">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
              <div>Total Score: {(scores[1] || 0) + (scores[2] || 0)}</div>
              <div>Match Duration: 60s</div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={resetGame}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-xl font-bold"
            >
              🔄 REMATCH
            </Button>
            
            <Button
              onClick={startCharacterSelection}
              size="lg"
              variant="outline"
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-400 px-8 py-3 text-xl font-bold"
            >
              👥 NEW FIGHTERS
            </Button>
          </div>
          
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="bg-gray-800/80 text-white border-gray-600"
          >
            🏠 Main Menu
          </Button>
        </div>

        {/* Motivational Message */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm p-4 max-w-md mx-auto">
          <p className="text-white/90 italic">
            {winner ? 
              "\"A true warrior learns from every battle. Ready for the next challenge?\"" :
              "\"Every draw makes you stronger. The next fight awaits!\""
            }
          </p>
        </Card>
      </div>
    </div>
  );
}
