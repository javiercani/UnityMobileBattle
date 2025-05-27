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
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
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
      
      // Animate arms during attack
      if (leftArmRef.current && rightArmRef.current) {
        // Alternating punching motion
        leftArmRef.current.position.z = Math.sin(time * 30) * 0.4;
        rightArmRef.current.position.z = Math.sin(time * 30 + Math.PI) * 0.4;
        leftArmRef.current.rotation.x = Math.sin(time * 30) * 0.3;
        rightArmRef.current.rotation.x = Math.sin(time * 30 + Math.PI) * 0.3;
      }
      
      // Animate legs during kicks
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.position.z = Math.sin(time * 20) * 0.2;
        rightLegRef.current.position.z = Math.sin(time * 20 + Math.PI) * 0.2;
        leftLegRef.current.rotation.x = Math.sin(time * 20) * 0.2;
        rightLegRef.current.rotation.x = Math.sin(time * 20 + Math.PI) * 0.2;
      }
    } else if (fighter.isMoving) {
      // Walking animation - subtle bob and natural limb movement
      bobOffset = Math.sin(time * 8) * 0.05;
      meshRef.current.rotation.x = 0;
      meshRef.current.rotation.z = 0;
      
      // Walking arm swing
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(time * 8) * 0.3;
        rightArmRef.current.rotation.x = Math.sin(time * 8 + Math.PI) * 0.3;
        leftArmRef.current.position.z = 0;
        rightArmRef.current.position.z = 0;
      }
      
      // Walking leg movement
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(time * 8 + Math.PI) * 0.2;
        rightLegRef.current.rotation.x = Math.sin(time * 8) * 0.2;
        leftLegRef.current.position.z = 0;
        rightLegRef.current.position.z = 0;
      }
    } else {
      // Idle animation - gentle sway and breathing
      bobOffset = Math.sin(time * 2) * 0.02;
      meshRef.current.rotation.x = 0;
      meshRef.current.rotation.z = 0;
      
      // Idle arm sway
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(time * 2) * 0.05;
        rightArmRef.current.rotation.x = Math.sin(time * 2.5) * 0.05;
        leftArmRef.current.position.z = 0;
        rightArmRef.current.position.z = 0;
      }
      
      // Reset legs to neutral
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = 0;
        rightLegRef.current.rotation.x = 0;
        leftLegRef.current.position.z = 0;
        rightLegRef.current.position.z = 0;
      }
    }
    
    meshRef.current.position.y = fighter.position.y + bobOffset;
  });

  // Get fighter appearance based on selected character
  const getCharacterAppearance = () => {
    switch (fighter?.characterId) {
      case 'ryu':
        return {
          bodyColor: '#FFFFFF',
          skinColor: '#FDBCB4',
          pantsColor: '#E2E8F0',
          beltColor: '#000000',
          headband: true,
          gloves: false
        };
      case 'chun':
        return {
          bodyColor: '#0066CC',
          skinColor: '#F7D794',
          pantsColor: '#1A202C',
          beltColor: '#FFD700',
          headband: false,
          gloves: true
        };
      case 'ken':
        return {
          bodyColor: '#FF4444',
          skinColor: '#FDBCB4',
          pantsColor: '#FFD700',
          beltColor: '#8B4513',
          headband: false,
          gloves: true
        };
      case 'blanka':
        return {
          bodyColor: '#00FF00',
          skinColor: '#228B22',
          pantsColor: '#FF8C00',
          beltColor: '#654321',
          headband: false,
          gloves: false
        };
      case 'zangief':
        return {
          bodyColor: '#FF6B6B',
          skinColor: '#DEB887',
          pantsColor: '#8B0000',
          beltColor: '#FFD700',
          headband: true,
          gloves: false
        };
      case 'dhalsim':
        return {
          bodyColor: '#FF8800',
          skinColor: '#D2691E',
          pantsColor: '#FFFFFF',
          beltColor: '#800080',
          headband: true,
          gloves: false
        };
      default:
        return {
          bodyColor: '#FF6B6B',
          skinColor: '#FDBCB4',
          pantsColor: '#4A5568',
          beltColor: '#000000',
          headband: false,
          gloves: false
        };
    }
  };

  const appearance = getCharacterAppearance();

  return (
    <group ref={meshRef} position={position}>
      {/* Main body with character-specific color */}
      <mesh castShadow position={[0, 1, 0]}>
        <boxGeometry args={[0.8, 1.6, 0.6]} />
        <meshLambertMaterial 
          color={hitEffect.active ? "#FF6B6B" : appearance.bodyColor}
          transparent={hitEffect.active}
          opacity={hitEffect.active ? 0.7 : 1}
        />
      </mesh>
      
      {/* Head with character-specific skin color */}
      <mesh castShadow position={[0, 2.2, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshLambertMaterial color={hitEffect.active ? "#FF6B6B" : appearance.skinColor} />
      </mesh>
      
      {/* Character-specific headband (if applicable) */}
      {appearance.headband && (
        <mesh castShadow position={[0, 2.4, 0]}>
          <boxGeometry args={[0.7, 0.1, 0.7]} />
          <meshLambertMaterial color={appearance.beltColor} />
        </mesh>
      )}
      
      {/* Arms with character-specific skin color and optional gloves */}
      <mesh ref={leftArmRef} castShadow position={[-0.6, 1.4, 0]}>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshLambertMaterial color={hitEffect.active ? "#FF6B6B" : appearance.skinColor} />
      </mesh>
      
      <mesh ref={rightArmRef} castShadow position={[0.6, 1.4, 0]}>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshLambertMaterial color={hitEffect.active ? "#FF6B6B" : appearance.skinColor} />
      </mesh>
      
      {/* Character-specific gloves (if applicable) */}
      {appearance.gloves && (
        <>
          <mesh castShadow position={[-0.6, 0.8, 0]}>
            <boxGeometry args={[0.35, 0.4, 0.35]} />
            <meshLambertMaterial color={appearance.bodyColor} />
          </mesh>
          <mesh castShadow position={[0.6, 0.8, 0]}>
            <boxGeometry args={[0.35, 0.4, 0.35]} />
            <meshLambertMaterial color={appearance.bodyColor} />
          </mesh>
        </>
      )}
      
      {/* Legs with character-specific pants color */}
      <mesh ref={leftLegRef} castShadow position={[-0.25, -0.2, 0]}>
        <boxGeometry args={[0.3, 1.2, 0.4]} />
        <meshLambertMaterial color={appearance.pantsColor} />
      </mesh>
      
      <mesh ref={rightLegRef} castShadow position={[0.25, -0.2, 0]}>
        <boxGeometry args={[0.3, 1.2, 0.4]} />
        <meshLambertMaterial color={appearance.pantsColor} />
      </mesh>
      
      {/* Character belt */}
      <mesh castShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[0.9, 0.2, 0.7]} />
        <meshLambertMaterial color={appearance.beltColor} />
      </mesh>
      
      {/* Character-specific special features */}
      {fighter?.characterId === 'blanka' && (
        // Blanka's wild hair spikes
        <>
          <mesh castShadow position={[-0.2, 2.6, 0]}>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <meshLambertMaterial color="#32CD32" />
          </mesh>
          <mesh castShadow position={[0, 2.7, 0]}>
            <boxGeometry args={[0.1, 0.4, 0.1]} />
            <meshLambertMaterial color="#32CD32" />
          </mesh>
          <mesh castShadow position={[0.2, 2.6, 0]}>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <meshLambertMaterial color="#32CD32" />
          </mesh>
        </>
      )}
      
      {fighter?.characterId === 'zangief' && (
        // Zangief's chest hair and scars
        <>
          <mesh castShadow position={[0, 1.3, 0.31]}>
            <boxGeometry args={[0.2, 0.4, 0.05]} />
            <meshLambertMaterial color="#8B4513" />
          </mesh>
          <mesh castShadow position={[0.1, 1.5, 0.31]}>
            <boxGeometry args={[0.6, 0.05, 0.05]} />
            <meshLambertMaterial color="#FFB6C1" />
          </mesh>
        </>
      )}
      
      {fighter?.characterId === 'dhalsim' && (
        // Dhalsim's jewelry and skull necklace
        <>
          <mesh castShadow position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.05]} />
            <meshLambertMaterial color="#FFD700" />
          </mesh>
          <mesh castShadow position={[0, 1.6, 0.31]}>
            <boxGeometry args={[0.1, 0.1, 0.05]} />
            <meshLambertMaterial color="#FFFFFF" />
          </mesh>
        </>
      )}
      
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
