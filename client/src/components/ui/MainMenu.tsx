import { useFighting } from "../../lib/stores/useFighting";
import { useAudio } from "../../lib/stores/useAudio";
import { Button } from "./button";
import { Card } from "./card";

export default function MainMenu() {
  const { startCharacterSelection } = useFighting();
  const { toggleMute, isMuted } = useAudio();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 to-blue-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            ⭐
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center space-y-8 p-4">
        {/* Main Title */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-lg">
            STREET CLASH
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-yellow-400 drop-shadow-lg">
            BATTLEGROUND
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Enter the arena and prove your fighting skills in this epic 3D battle game!
          </p>
        </div>

        {/* Game Features */}
        <Card className="bg-black/50 backdrop-blur-sm border-2 border-yellow-400 p-6 max-w-md mx-auto">
          <div className="space-y-3 text-white">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">⚔️</span>
              <span>Fast-paced 3D fighting</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">🎮</span>
              <span>Touch-friendly controls</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">🏆</span>
              <span>Multiple unique fighters</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">⚡</span>
              <span>Energy-based combat</span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={startCharacterSelection}
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 text-xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            🥊 START GAME
          </Button>
          
          <div className="flex justify-center gap-4">
            <Button
              onClick={toggleMute}
              variant="outline"
              size="lg"
              className="bg-gray-800/80 text-white border-gray-600 hover:bg-gray-700"
            >
              {isMuted ? "🔇 Sound Off" : "🔊 Sound On"}
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <Card className="bg-white/10 backdrop-blur-sm p-4 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-yellow-400 mb-3">How to Play</h3>
          <div className="text-white/90 text-left space-y-2">
            <p>• Use WASD or arrow keys to move your fighter</p>
            <p>• Attack with J/U (punches) and K/I (kicks)</p>
            <p>• Drain your opponent's energy to win!</p>
            <p>• Each successful hit reduces their energy bar</p>
            <p>• On mobile, use the touch controls</p>
          </div>
        </Card>

        {/* Version Info */}
        <div className="text-white/60 text-sm">
          Street Clash: Battleground v1.0 | Made with ❤️ and Three.js
        </div>
      </div>
    </div>
  );
}
