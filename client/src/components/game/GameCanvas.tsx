import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Lighting from "./Lighting";
import Arena from "./Arena";
import Fighter from "./Fighter";
import { useFighting } from "../../lib/stores/useFighting";

export default function GameCanvas() {
  const { fighters } = useFighting();

  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        camera={{
          position: [0, 8, 12],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          powerPreference: "default"
        }}
      >
        <color attach="background" args={["#1a202c"]} />
        
        <Suspense fallback={null}>
          <Lighting />
          <Arena />
          
          {/* Player 1 */}
          {fighters[1] && (
            <Fighter playerId={1} isAI={false} />
          )}
          
          {/* Player 2 (AI) */}
          {fighters[2] && (
            <Fighter playerId={2} isAI={true} />
          )}
        </Suspense>
        
        {/* Camera controls for development (can be removed) */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 4}
          target={[0, 1, 0]}
        />
      </Canvas>
    </div>
  );
}
