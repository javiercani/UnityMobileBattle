import { Suspense, useEffect } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { useFighting } from "./lib/stores/useFighting";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";

// Import game components
import MainMenu from "./components/ui/MainMenu";
import CharacterSelection from "./components/ui/CharacterSelection";
import GameCanvas from "./components/game/GameCanvas";
import GameUI from "./components/ui/GameUI";
import ResultScreen from "./components/ui/ResultScreen";

// Define control keys for the game
const controls = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "leftward", keys: ["KeyA", "ArrowLeft"] },
  { name: "rightward", keys: ["KeyD", "ArrowRight"] },
  { name: "punchHigh", keys: ["KeyJ"] },
  { name: "punchLow", keys: ["KeyU"] },
  { name: "kickHigh", keys: ["KeyK"] },
  { name: "kickLow", keys: ["KeyI"] },
  { name: "block", keys: ["KeyL"] },
  { name: "special", keys: ["Space"] },
];

// Main App component
function App() {
  const { gamePhase } = useFighting();
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  // Initialize audio
  useEffect(() => {
    // Create audio elements
    const bgMusic = new Audio("/sounds/background.mp3");
    const hitSfx = new Audio("/sounds/hit.mp3");
    const successSfx = new Audio("/sounds/success.mp3");

    // Configure background music
    bgMusic.loop = true;
    bgMusic.volume = 0.3;

    // Configure sound effects
    hitSfx.volume = 0.5;
    successSfx.volume = 0.4;

    // Set in store
    setBackgroundMusic(bgMusic);
    setHitSound(hitSfx);
    setSuccessSound(successSfx);
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return (
    <div className="w-full h-full bg-gradient-to-b from-blue-900 to-purple-900 overflow-hidden">
      <KeyboardControls map={controls}>
        {/* Main Menu */}
        {gamePhase === 'menu' && <MainMenu />}

        {/* Character Selection */}
        {gamePhase === 'character_selection' && <CharacterSelection />}

        {/* Game Phase */}
        {(gamePhase === 'fighting' || gamePhase === 'round_end') && (
          <>
            <GameCanvas />
            <GameUI />
          </>
        )}

        {/* Result Screen */}
        {gamePhase === 'match_end' && <ResultScreen />}
      </KeyboardControls>
    </div>
  );
}

export default App;
