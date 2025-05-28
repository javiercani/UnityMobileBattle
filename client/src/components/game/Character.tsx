import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Html } from "@react-three/drei";
import * as THREE from "three";
import { useFighting } from "../../lib/stores/useFighting";
import { FighterData, accessories } from "../../lib/game/fighters";

interface CharacterProps {
  playerId: 1 | 2;
  position: [number, number, number];
  color: string;
}



export default function Character({ playerId, position, color }: CharacterProps) {
  const meshRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const leftHandRef = useRef<THREE.Mesh>(null);
  const rightHandRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const { fighters, hitEffects } = useFighting();
  
  const fighter = fighters[playerId];
  const hitEffect = hitEffects[playerId];

  // Load character textures
  const textures = useTexture({
    body: `/textures/characters/${fighter?.characterId}/body.svg`,
    skin: `/textures/characters/${fighter?.characterId}/skin.svg`,
    pants: `/textures/characters/${fighter?.characterId}/pants.svg`,
    belt: `/textures/characters/${fighter?.characterId}/belt.svg`,
  });

  // Configure texture properties
  Object.values(textures).forEach(texture => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
  });

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
      const attackSpeed = 12;
      const attackPhase = time * attackSpeed;
      
      // Get character-specific special moves
      const getSpecialMoveParams = () => {
        switch (fighter.characterId) {
          case 'giovanni':
            return {
              bodyRotation: Math.sin(attackPhase) * 0.5,
              punchForce: 1.2,
              punchRotation: 0.8,
              kickForce: 0.6,
              kickRotation: 1.0,
              specialEffect: 'pizza-spin'
            };
          case 'sofia':
            return {
              bodyRotation: Math.cos(attackPhase) * 0.4,
              punchForce: 0.9,
              punchRotation: 1.2,
              kickForce: 0.8,
              kickRotation: 1.4,
              specialEffect: 'gelato-swirl'
            };
          case 'marco':
            return {
              bodyRotation: Math.sin(attackPhase * 1.5) * 0.3,
              punchForce: 1.0,
              punchRotation: 1.0,
              kickForce: 0.7,
              kickRotation: 0.9,
              specialEffect: 'coffee-burst'
            };
          case 'lucia':
            return {
              bodyRotation: Math.sin(attackPhase * 0.8) * 0.6,
              punchForce: 0.8,
              punchRotation: 1.4,
              kickForce: 1.2,
              kickRotation: 1.6,
              specialEffect: 'pasta-whirl'
            };
          case 'antonio':
            return {
              bodyRotation: Math.cos(attackPhase * 1.2) * 0.5,
              punchForce: 1.4,
              punchRotation: 0.6,
              kickForce: 0.9,
              kickRotation: 1.2,
              specialEffect: 'gondola-wave'
            };
          case 'francesca':
            return {
              bodyRotation: Math.sin(attackPhase * 0.9) * 0.4,
              punchForce: 1.1,
              punchRotation: 1.0,
              kickForce: 1.0,
              kickRotation: 1.3,
              specialEffect: 'opera-spin'
            };
          default:
            return {
              bodyRotation: Math.sin(attackPhase) * 0.3,
              punchForce: 0.8,
              punchRotation: 0.6,
              kickForce: 0.5,
              kickRotation: 0.8,
              specialEffect: 'default'
            };
        }
      };
      
      const moveParams = getSpecialMoveParams();
      
      // Dynamic body movement with character-specific rotation
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        moveParams.bodyRotation,
        0.25
      );
      
      // Weight and lean adjustments
      bobOffset = THREE.MathUtils.lerp(
        bobOffset,
        Math.sin(attackPhase) * 0.15,
        0.2
      );
      
      const leanForce = Math.sin(attackPhase) * 0.15;
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        leanForce,
        0.25
      );
      
      if (leftArmRef.current && rightArmRef.current) {
        // Character-specific punch animations
        leftArmRef.current.position.z = THREE.MathUtils.lerp(
          leftArmRef.current.position.z,
          Math.sin(attackPhase) * moveParams.punchForce,
          0.3
        );
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(
          leftArmRef.current.rotation.x,
          Math.sin(attackPhase) * moveParams.punchRotation - Math.PI / 4,
          0.3
        );
        
        rightArmRef.current.position.z = THREE.MathUtils.lerp(
          rightArmRef.current.position.z,
          Math.sin(attackPhase + Math.PI * 0.6) * moveParams.punchForce,
          0.3
        );
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.x,
          Math.sin(attackPhase + Math.PI * 0.6) * moveParams.punchRotation - Math.PI / 4,
          0.3
        );
      }
      
      if (leftLegRef.current && rightLegRef.current) {
        // Character-specific kick animations
        const kickPhase = attackPhase * 0.7;
        
        leftLegRef.current.position.z = THREE.MathUtils.lerp(
          leftLegRef.current.position.z,
          Math.sin(kickPhase) * moveParams.kickForce,
          0.25
        );
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(
          leftLegRef.current.rotation.x,
          Math.sin(kickPhase) * moveParams.kickRotation - Math.PI / 6,
          0.25
        );
        
        rightLegRef.current.position.z = THREE.MathUtils.lerp(
          rightLegRef.current.position.z,
          Math.sin(kickPhase + Math.PI) * moveParams.kickForce * 0.3,
          0.25
        );
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(
          rightLegRef.current.rotation.x,
          Math.sin(kickPhase + Math.PI) * moveParams.kickRotation * 0.3,
          0.25
        );
      }
      
      // Special attack effects
      if (hitEffect.active) {
        const effectIntensity = Math.sin(time * 20) * 0.5 + 0.5;
        switch (moveParams.specialEffect) {
          case 'pizza-spin':
            meshRef.current.rotation.y += effectIntensity * 0.2;
            break;
          case 'gelato-swirl':
            meshRef.current.position.y += Math.sin(time * 15) * 0.1;
            break;
          case 'coffee-burst':
            meshRef.current.scale.x = meshRef.current.scale.z = 1 + effectIntensity * 0.2;
            break;
          case 'pasta-whirl':
            meshRef.current.rotation.z += Math.cos(time * 10) * 0.1;
            break;
          case 'gondola-wave':
            meshRef.current.position.x += Math.sin(time * 12) * 0.05;
            break;
          case 'opera-spin':
            meshRef.current.rotation.x += Math.sin(time * 18) * 0.15;
            break;
        }
      }
    } else if (fighter.isMoving) {
      // Enhanced walking animation with natural movement
      const walkSpeed = 8;
      bobOffset = THREE.MathUtils.lerp(bobOffset, Math.sin(time * walkSpeed) * 0.08, 0.1);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, Math.sin(time * walkSpeed * 0.5) * 0.05, 0.1);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, Math.sin(time * walkSpeed) * 0.03, 0.1);
      
      // Natural arm swing during walking
      if (leftArmRef.current && rightArmRef.current) {
        const armSwing = 0.35;
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, Math.sin(time * walkSpeed) * armSwing, 0.1);
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, Math.sin(time * walkSpeed + Math.PI) * armSwing, 0.1);
        leftArmRef.current.position.z = THREE.MathUtils.lerp(leftArmRef.current.position.z, Math.sin(time * walkSpeed) * 0.1, 0.1);
        rightArmRef.current.position.z = THREE.MathUtils.lerp(rightArmRef.current.position.z, Math.sin(time * walkSpeed + Math.PI) * 0.1, 0.1);
      }
      
      // Natural leg movement during walking
      if (leftLegRef.current && rightLegRef.current) {
        const legSwing = 0.25;
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, Math.sin(time * walkSpeed + Math.PI) * legSwing, 0.1);
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, Math.sin(time * walkSpeed) * legSwing, 0.1);
        leftLegRef.current.position.z = THREE.MathUtils.lerp(leftLegRef.current.position.z, Math.sin(time * walkSpeed + Math.PI) * 0.15, 0.1);
        rightLegRef.current.position.z = THREE.MathUtils.lerp(rightLegRef.current.position.z, Math.sin(time * walkSpeed) * 0.15, 0.1);
      }
    } else {
      // Enhanced idle animation with subtle breathing and movement
      const breathingSpeed = 2;
      bobOffset = THREE.MathUtils.lerp(bobOffset, Math.sin(time * breathingSpeed) * 0.03, 0.05);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, Math.sin(time * breathingSpeed * 0.5) * 0.02, 0.05);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, Math.sin(time * breathingSpeed * 0.7) * 0.01, 0.05);
      
      // Subtle arm movement during idle
      if (leftArmRef.current && rightArmRef.current) {
        const idleArmMovement = 0.08;
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, Math.sin(time * breathingSpeed) * idleArmMovement, 0.05);
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, Math.sin(time * breathingSpeed * 1.1) * idleArmMovement, 0.05);
        leftArmRef.current.position.z = THREE.MathUtils.lerp(leftArmRef.current.position.z, Math.sin(time * breathingSpeed * 0.9) * 0.02, 0.05);
        rightArmRef.current.position.z = THREE.MathUtils.lerp(rightArmRef.current.position.z, Math.sin(time * breathingSpeed * 1.2) * 0.02, 0.05);
      }
      
      // Subtle leg movement during idle
      if (leftLegRef.current && rightLegRef.current) {
        const idleLegMovement = 0.05;
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, Math.sin(time * breathingSpeed * 0.8) * idleLegMovement, 0.05);
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, Math.sin(time * breathingSpeed * 1.2) * idleLegMovement, 0.05);
        leftLegRef.current.position.z = THREE.MathUtils.lerp(leftLegRef.current.position.z, 0, 0.05);
        rightLegRef.current.position.z = THREE.MathUtils.lerp(rightLegRef.current.position.z, 0, 0.05);
      }
    }
    
    meshRef.current.position.y = fighter.position.y + bobOffset;
  });

  // Get fighter appearance based on selected character
  const getCharacterAppearance = () => {
    switch (fighter?.characterId) {
      case 'giovanni':
        return {
          bodyColor: '#FF6B47', // Pizza red shirt
          skinColor: '#FDBCB4',
          pantsColor: '#FFFFFF', // White chef pants
          beltColor: '#8B4513', // Brown leather belt
          headband: true, // Chef hat
          gloves: false
        };
      case 'sofia':
        return {
          bodyColor: '#FFB3E6', // Pink gelato outfit
          skinColor: '#F7D794',
          pantsColor: '#E6E6FA', // Lavender pants
          beltColor: '#FFD700', // Golden sash
          headband: false,
          gloves: true // Ice cream serving gloves
        };
      case 'marco':
        return {
          bodyColor: '#8B4513', // Coffee brown vest
          skinColor: '#FDBCB4',
          pantsColor: '#2F4F4F', // Dark slate pants
          beltColor: '#000000', // Black belt
          headband: false,
          gloves: false
        };
      case 'lucia':
        return {
          bodyColor: '#FFD700', // Golden pasta chef outfit
          skinColor: '#FDBCB4',
          pantsColor: '#228B22', // Italian green pants
          beltColor: '#DC143C', // Red italian belt
          headband: true, // Pasta chef hat
          gloves: true // Cooking gloves
        };
      case 'antonio':
        return {
          bodyColor: '#0066CC', // Blue gondolier shirt
          skinColor: '#DEB887',
          pantsColor: '#FFFFFF', // White sailor pants
          beltColor: '#FFD700', // Golden sash
          headband: true, // Gondolier hat
          gloves: false
        };
      case 'francesca':
        return {
          bodyColor: '#8B0000', // Deep red opera dress
          skinColor: '#F5DEB3',
          pantsColor: '#4B0082', // Indigo opera skirt
          beltColor: '#FFD700', // Golden opera belt
          headband: false,
          gloves: true // Elegant opera gloves
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
      {/* Main body with character texture - using capsuleGeometry */}
      <group position={[0, 1, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.4, 0.8, 8, 8]} />
          <meshStandardMaterial 
            map={textures.body}
            color={hitEffect.active ? "#FF6B6B" : "white"}
            transparent={hitEffect.active}
            opacity={hitEffect.active ? 0.7 : 1}
          />
        </mesh>
      </group>
      
      {/* Head with skin texture - now using sphereGeometry */}
      <mesh castShadow position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.35]} />
        <meshStandardMaterial 
          map={textures.skin}
          color={hitEffect.active ? "#FF6B6B" : "white"}
        />
      </mesh>
      
      {/* Arms with skin texture - using cylinderGeometry */}
      <mesh ref={leftArmRef} castShadow position={[-0.6, 1.4, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1, 8]} />
        <meshStandardMaterial 
          map={textures.skin}
          color={hitEffect.active ? "#FF6B6B" : "white"}
        />
      </mesh>
      
      <mesh ref={rightArmRef} castShadow position={[0.6, 1.4, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1, 8]} />
        <meshStandardMaterial 
          map={textures.skin}
          color={hitEffect.active ? "#FF6B6B" : "white"}
        />
      </mesh>

      {/* Hands with skin texture - using sphereGeometry */}
      <mesh ref={leftHandRef} castShadow position={[-0.75, 1.4, 0.15]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial
          map={textures.skin}
          color={hitEffect.active ? "#FF6B6B" : "white"}
        />
      </mesh>

      <mesh ref={rightHandRef} castShadow position={[0.75, 1.4, 0.15]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial
          map={textures.skin}
          color={hitEffect.active ? "#FF6B6B" : "white"}
        />
      </mesh>

      {/* Accessory */}
      {fighter.accessory && (
        <mesh castShadow position={[0.9, 1.7, 0.3]} rotation={[0, 0, 0]} >
          <sphereGeometry args={[0.15]} />
          <meshStandardMaterial color="gray" />
          <Html>
            <div style={{ color: 'black', fontSize: '0.6em' }}>
              {accessories[fighter.accessory].name}
            </div>
          </Html>
        </mesh>
      )}
      
      {/* Legs with pants texture - using cylinderGeometry */}
      <mesh ref={leftLegRef} castShadow position={[-0.25, -0.2, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 8]} />
        <meshStandardMaterial 
          map={textures.pants}
          color={hitEffect.active ? "#FF6B6B" : "white"}
        />
      </mesh>
      
      <mesh ref={rightLegRef} castShadow position={[0.25, -0.2, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 8]} />
        <meshStandardMaterial 
          map={textures.pants}
          color={hitEffect.active ? "#FF6B6B" : "white"}
        />
      </mesh>

      {/* Accessory */}
      {fighter.accessory && (
        <mesh castShadow position={[0.9, 1.7, 0.3]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.15]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      )}
      
      {/* Belt with texture - using torusGeometry */}
      <mesh castShadow position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.1, 8, 16]} />
        <meshStandardMaterial 
          map={textures.belt}
          color={hitEffect.active ? "#FF6B6B" : "white"}
        />
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
