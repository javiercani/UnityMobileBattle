import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Lighting() {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    // Subtle light movement for dynamic shadows
    if (directionalLightRef.current) {
      directionalLightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 2;
    }
  });

  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.4} color="#404040" />
      
      {/* Main directional light (sun) */}
      <directionalLight
        ref={directionalLightRef}
        position={[10, 20, 5]}
        intensity={1}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Fill light from the opposite side */}
      <directionalLight
        position={[-10, 15, -5]}
        intensity={0.3}
        color="#4299e1"
      />
      
      {/* Ground bounce light */}
      <pointLight
        position={[0, 1, 0]}
        intensity={0.2}
        color="#ffd700"
        distance={20}
      />
      
      {/* Dramatic side lighting */}
      <spotLight
        position={[-15, 10, 0]}
        angle={0.3}
        penumbra={0.5}
        intensity={0.5}
        color="#e53e3e"
        castShadow
      />
      
      <spotLight
        position={[15, 10, 0]}
        angle={0.3}
        penumbra={0.5}
        intensity={0.5}
        color="#3182ce"
        castShadow
      />
    </>
  );
}
