import { useEffect } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useFighting } from "../../lib/stores/useFighting";
import { useControls } from "../../lib/stores/useControls";
import Character from "./Character";

interface FighterProps {
  playerId: 1 | 2;
  isAI?: boolean;
}

export default function Fighter({ playerId, isAI = false }: FighterProps) {
  const { fighters, updateFighterPosition, performAttack, checkCollision } = useFighting();
  const { player1Controls, player2Controls } = useControls();
  
  const [subscribe, getState] = useKeyboardControls();
  const fighter = fighters[playerId];
  const opponent = fighters[playerId === 1 ? 2 : 1];

  // Movement and attack logic
  useFrame((state, delta) => {
    if (!fighter || !opponent) return;

    let movement = { x: 0, z: 0 };
    let shouldAttack = false;
    let attackType = '';

    if (isAI && playerId === 2) {
      // Simple AI logic
      const distance = Math.abs(fighter.position.x - opponent.position.x);
      const time = state.clock.elapsedTime;
      
      // Move towards opponent if too far
      if (distance > 2) {
        movement.x = opponent.position.x > fighter.position.x ? 0.5 : -0.5;
      }
      
      // Random attacks when close
      if (distance < 2.5 && Math.sin(time * 3) > 0.7) {
        shouldAttack = true;
        attackType = Math.random() > 0.5 ? 'punchHigh' : 'kickHigh';
      }
      
      // Occasional random movement
      if (Math.sin(time * 2) > 0.8) {
        movement.z = Math.sin(time * 5) * 0.3;
      }
    } else {
      // Human player controls
      const controls = getState();
      const playerControls = playerId === 1 ? player1Controls : player2Controls;

      // Movement
      if (controls[playerControls.left]) movement.x -= 1;
      if (controls[playerControls.right]) movement.x += 1;
      if (controls[playerControls.forward]) movement.z -= 1;
      if (controls[playerControls.backward]) movement.z += 1;

      // Attacks
      if (controls[playerControls.punchHigh]) {
        shouldAttack = true;
        attackType = 'punchHigh';
      } else if (controls[playerControls.punchLow]) {
        shouldAttack = true;
        attackType = 'punchLow';
      } else if (controls[playerControls.kickHigh]) {
        shouldAttack = true;
        attackType = 'kickHigh';
      } else if (controls[playerControls.kickLow]) {
        shouldAttack = true;
        attackType = 'kickLow';
      }
    }

    // Apply movement
    if (movement.x !== 0 || movement.z !== 0) {
      const speed = 3;
      const newX = fighter.position.x + movement.x * speed * delta;
      const newZ = fighter.position.z + movement.z * speed * delta;
      
      // Boundary checking
      const boundedX = Math.max(-9, Math.min(9, newX));
      const boundedZ = Math.max(-5, Math.min(5, newZ));
      
      updateFighterPosition(playerId, boundedX, fighter.position.y, boundedZ, true);
    } else {
      updateFighterPosition(playerId, fighter.position.x, fighter.position.y, fighter.position.z, false);
    }

    // Handle attacks
    if (shouldAttack && !fighter.isAttacking) {
      performAttack(playerId, attackType);
      
      // Check if attack hits opponent
      const distance = Math.sqrt(
        Math.pow(fighter.position.x - opponent.position.x, 2) +
        Math.pow(fighter.position.z - opponent.position.z, 2)
      );
      
      if (distance < 2) {
        checkCollision(playerId, playerId === 1 ? 2 : 1);
      }
    }
  });

  // Get fighter color based on selected character
  const getCharacterColor = () => {
    switch (fighter?.characterId) {
      case 'ryu': return '#FFFFFF';
      case 'chun': return '#0066CC';
      case 'ken': return '#FFD700';
      default: return '#FF6B6B';
    }
  };

  if (!fighter) return null;

  return (
    <Character
      playerId={playerId}
      position={[fighter.position.x, fighter.position.y, fighter.position.z]}
      color={getCharacterColor()}
    />
  );
}
