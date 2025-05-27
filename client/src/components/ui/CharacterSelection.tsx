import { useState } from "react";
import { useFighting } from "../../lib/stores/useFighting";
import { fighters } from "../../lib/game/fighters";
import { Button } from "./button";
import { Card } from "./card";

export default function CharacterSelection() {
  const { setSelectedCharacters, startFight } = useFighting();
  const [player1Selection, setPlayer1Selection] = useState<string>('');
  const [player2Selection, setPlayer2Selection] = useState<string>('');

  const handleStartFight = () => {
    if (player1Selection && player2Selection) {
      setSelectedCharacters(player1Selection, player2Selection);
      startFight();
    }
  };

  const handleRandomSelection = () => {
    const fighterIds = Object.keys(fighters);
    const p1 = fighterIds[Math.floor(Math.random() * fighterIds.length)];
    let p2 = fighterIds[Math.floor(Math.random() * fighterIds.length)];
    // Ensure different characters
    while (p2 === p1) {
      p2 = fighterIds[Math.floor(Math.random() * fighterIds.length)];
    }
    setPlayer1Selection(p1);
    setPlayer2Selection(p2);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 to-blue-900 p-4">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl md:text-6xl font-bold text-center text-white mb-8 text-shadow">
          SELECT YOUR FIGHTERS
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Player 1 Selection */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-blue-300">PLAYER 1</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(fighters).map(([id, fighter]) => (
                <Card 
                  key={id}
                  className={`p-4 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    player1Selection === id 
                      ? 'ring-4 ring-blue-400 bg-blue-100' 
                      : 'bg-white hover:bg-gray-100'
                  }`}
                  onClick={() => setPlayer1Selection(id)}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-2xl"
                         style={{ backgroundColor: fighter.color }}>
                      {fighter.emoji}
                    </div>
                    <h3 className="font-bold text-lg">{fighter.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{fighter.style}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Speed:</span>
                        <div className="w-16 h-2 bg-gray-200 rounded">
                          <div 
                            className="h-2 bg-blue-500 rounded" 
                            style={{ width: `${fighter.stats.speed * 10}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Power:</span>
                        <div className="w-16 h-2 bg-gray-200 rounded">
                          <div 
                            className="h-2 bg-red-500 rounded" 
                            style={{ width: `${fighter.stats.power * 10}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Defense:</span>
                        <div className="w-16 h-2 bg-gray-200 rounded">
                          <div 
                            className="h-2 bg-green-500 rounded" 
                            style={{ width: `${fighter.stats.defense * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Player 2 Selection */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-red-300">PLAYER 2 (AI)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(fighters).map(([id, fighter]) => (
                <Card 
                  key={id}
                  className={`p-4 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    player2Selection === id 
                      ? 'ring-4 ring-red-400 bg-red-100' 
                      : 'bg-white hover:bg-gray-100'
                  }`}
                  onClick={() => setPlayer2Selection(id)}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-2xl"
                         style={{ backgroundColor: fighter.color }}>
                      {fighter.emoji}
                    </div>
                    <h3 className="font-bold text-lg">{fighter.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{fighter.style}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Speed:</span>
                        <div className="w-16 h-2 bg-gray-200 rounded">
                          <div 
                            className="h-2 bg-blue-500 rounded" 
                            style={{ width: `${fighter.stats.speed * 10}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Power:</span>
                        <div className="w-16 h-2 bg-gray-200 rounded">
                          <div 
                            className="h-2 bg-red-500 rounded" 
                            style={{ width: `${fighter.stats.power * 10}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Defense:</span>
                        <div className="w-16 h-2 bg-gray-200 rounded">
                          <div 
                            className="h-2 bg-green-500 rounded" 
                            style={{ width: `${fighter.stats.defense * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handleRandomSelection}
            variant="outline"
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-400"
          >
            🎲 Random Selection
          </Button>
          
          <Button
            onClick={handleStartFight}
            disabled={!player1Selection || !player2Selection}
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-xl font-bold"
          >
            ⚔️ START FIGHT!
          </Button>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-white/80 text-sm">
          <p>Select fighters for both players, then start the battle!</p>
        </div>
      </div>
    </div>
  );
}
