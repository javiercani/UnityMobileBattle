import { useRef } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Arena() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Load textures
  const grassTexture = useTexture("/textures/grass.png");
  const asphaltTexture = useTexture("/textures/asphalt.png");
  
  // Configure texture repeating
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(4, 4);
  
  asphaltTexture.wrapS = asphaltTexture.wrapT = THREE.RepeatWrapping;
  asphaltTexture.repeat.set(2, 2);

  return (
    <group ref={groupRef}>
      {/* Main fighting platform */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[20, 0.2, 12]} />
        <meshLambertMaterial map={asphaltTexture} />
      </mesh>
      
      {/* Background ground */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[50, 0.8, 30]} />
        <meshLambertMaterial map={grassTexture} />
      </mesh>
      
      {/* Side barriers (invisible collision) */}
      <mesh position={[-11, 2, 0]} visible={false}>
        <boxGeometry args={[1, 4, 12]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      <mesh position={[11, 2, 0]} visible={false}>
        <boxGeometry args={[1, 4, 12]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Arena decorations */}
      <group>
        {/* Corner posts */}
        {[[-9, 0, -5], [9, 0, -5], [-9, 0, 5], [9, 0, 5]].map((pos, i) => (
          <mesh key={i} position={pos} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 3]} />
            <meshLambertMaterial color="#8B4513" />
          </mesh>
        ))}
        
        {/* Background elements */}
        <mesh position={[0, 5, -15]} castShadow>
          <boxGeometry args={[30, 10, 2]} />
          <meshLambertMaterial color="#4A5568" />
        </mesh>
        
        {/* Crowd stands (simple geometric shapes) */}
        {[-15, 15].map((x, i) => (
          <group key={i} position={[x, 2, -8]}>
            <mesh castShadow>
              <boxGeometry args={[4, 4, 8]} />
              <meshLambertMaterial color={i === 0 ? "#E53E3E" : "#3182CE"} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
