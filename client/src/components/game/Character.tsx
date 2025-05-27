import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useFighting } from "../../lib/stores/useFighting";

interface CharacterProps {
  playerId: 1 | 2;
  position: [number, number, number];
  color: string;
}

export default function Character({ playerId, position, color }: CharacterProps) {
  const meshRef = useRef<THREE.Group>(null);
  const { fighters, hitEffects } = useFighting();
  
  const fighter = fighters[playerId];
  const hitEffect = hitEffects[playerId];

  useFrame((state) => {
    if (!meshRef.current || !fighter) return;

    // Update position
    meshRef.current.position.set(fighter.position.x, fighter.position.y, fighter.position.z);
    
    // Update rotation (face opponent)
    const targetRotation = playerId === 1 ? 
      (fighter.position.x < fighters[2]?.position.x ? 0 : Math.PI) :
      (fighter.position.x > fighters[1]?.position.x ? 0 : Math.PI);
    
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotation,
      0.1
    );

    // Animation based on state
    const time = state.clock.elapsedTime;
    let bobOffset = 0;
    
    if (fighter.isAttacking) {
      // Attack animation - lean forward and slightly up
      meshRef.current.rotation.x = Math.sin(time * 25) * 0.15;
      bobOffset = Math.sin(time * 20) * 0.15;
      
      // Add slight forward lean during attack
      meshRef.current.rotation.z = Math.sin(time * 30) * 0.05;
    } else if (fighter.isMoving) {
      // Walking animation - subtle bob
      bobOffset = Math.sin(time * 8) * 0.05;
      meshRef.current.rotation.x = 0;
      meshRef.current.rotation.z = 0;
    } else {
      // Idle animation - gentle sway
      bobOffset = Math.sin(time * 2) * 0.02;
      meshRef.current.rotation.x = 0;
      meshRef.current.rotation.z = 0;
    }
    
    meshRef.current.position.y = fighter.position.y + bobOffset;
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Main body */}
      <mesh castShadow position={[0, 1, 0]}>
        <boxGeometry args={[0.8, 1.6, 0.6]} />
        <meshLambertMaterial 
          color={hitEffect.active ? "#FF6B6B" : color}
          transparent={hitEffect.active}
          opacity={hitEffect.active ? 0.7 : 1}
        />
      </mesh>
      
      {/* Head */}
      <mesh castShadow position={[0, 2.2, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshLambertMaterial color={hitEffect.active ? "#FF6B6B" : "#FDBCB4"} />
      </mesh>
      
      {/* Arms */}
      <mesh 
        castShadow 
        position={[
          -0.6 + (fighter.isAttacking ? Math.sin(state.clock.elapsedTime * 25) * 0.2 : 0), 
          1.4, 
          fighter.isAttacking ? Math.sin(state.clock.elapsedTime * 25) * 0.3 : 0
        ]}
      >
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshLambertMaterial color={hitEffect.active ? "#FF6B6B" : "#FDBCB4"} />
      </mesh>
      
      <mesh 
        castShadow 
        position={[
          0.6 + (fighter.isAttacking ? Math.sin(state.clock.elapsedTime * 20) * 0.2 : 0), 
          1.4, 
          fighter.isAttacking ? Math.sin(state.clock.elapsedTime * 20) * 0.3 : 0
        ]}
      >
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshLambertMaterial color={hitEffect.active ? "#FF6B6B" : "#FDBCB4"} />
      </mesh>
      
      {/* Legs */}
      <mesh castShadow position={[-0.25, -0.2, 0]}>
        <boxGeometry args={[0.3, 1.2, 0.4]} />
        <meshLambertMaterial color="#4A5568" />
      </mesh>
      
      <mesh castShadow position={[0.25, -0.2, 0]}>
        <boxGeometry args={[0.3, 1.2, 0.4]} />
        <meshLambertMaterial color="#4A5568" />
      </mesh>
      
      {/* Hit effect particles */}
      {hitEffect.active && (
        <group>
          {[...Array(6)].map((_, i) => (
            <mesh key={i} position={[
              Math.sin(i) * 0.5,
              1 + Math.cos(i) * 0.5,
              Math.sin(i * 2) * 0.5
            ]}>
              <sphereGeometry args={[0.05]} />
              <meshBasicMaterial color="#FFD700" />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
