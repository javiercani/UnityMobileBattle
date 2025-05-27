import { useFighting } from "../../lib/stores/useFighting";
import { useAudio } from "../../lib/stores/useAudio";
import TouchControls from "./TouchControls";
import EnergyBar from "./EnergyBar";
import { Button } from "./button";
import { Card } from "./card";

export default function GameUI() {
  const { 
    fighters, 
    gameTimer, 
    gamePhase, 
    winner,
    resetGame 
  } = useFighting();
  
  const { toggleMute, isMuted } = useAudio();

  const player1 = fighters[1];
  const player2 = fighters[2];

  if (!player1 || !player2) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top UI Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 pointer-events-auto">
        <div className="flex justify-between items-start">
          {/* Player 1 Info */}
          <Card className="bg-blue-900/80 backdrop-blur-sm border-blue-400 text-white p-3">
            <div className="text-center">
              <h3 className="font-bold text-lg">{player1.name}</h3>
              <EnergyBar 
                current={player1.energy} 
                max={100} 
                color="blue"
                playerNumber={1}
              />
            </div>
          </Card>

          {/* Center Timer and Controls */}
          <div className="text-center space-y-2">
            <Card className="bg-black/80 backdrop-blur-sm text-white px-4 py-2">
              <div className="text-2xl font-bold font-mono">
                {Math.ceil(gameTimer)}
              </div>
            </Card>
            
            <div className="flex gap-2">
              <Button
                onClick={toggleMute}
                variant="outline"
                size="sm"
                className="bg-gray-800/80 text-white border-gray-600"
              >
                {isMuted ? "🔇" : "🔊"}
              </Button>
              
              <Button
                onClick={resetGame}
                variant="outline"
                size="sm"
                className="bg-gray-800/80 text-white border-gray-600"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Player 2 Info */}
          <Card className="bg-red-900/80 backdrop-blur-sm border-red-400 text-white p-3">
            <div className="text-center">
              <h3 className="font-bold text-lg">{player2.name}</h3>
              <EnergyBar 
                current={player2.energy} 
                max={100} 
                color="red"
                playerNumber={2}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Round End Overlay */}
      {gamePhase === 'round_end' && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-auto">
          <Card className="bg-white p-8 text-center">
            <h2 className="text-4xl font-bold mb-4">
              {winner ? `${fighters[winner]?.name} Wins!` : "Time's Up!"}
            </h2>
            <p className="text-lg text-gray-600">
              Next round starting soon...
            </p>
          </Card>
        </div>
      )}

      {/* Touch Controls for Mobile */}
      <TouchControls />

      {/* Combat Instructions */}
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <Card className="bg-black/80 backdrop-blur-sm text-white p-3 text-sm">
          <div className="space-y-1">
            <div><strong>Movement:</strong> WASD or Arrow Keys</div>
            <div><strong>Attacks:</strong> J (High Punch), U (Low Punch)</div>
            <div><strong></strong> K (High Kick), I (Low Kick)</div>
            <div><strong>Block:</strong> L</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
