import { FighterStats } from "./fighters";

export type AttackType = 'punch' | 'kick' | 'special' | 'combo';
export type AttackHeight = 'high' | 'low';

export interface Attack {
  type: AttackType;
  height: AttackHeight;
  damage: number;
  speed: number;      // How fast the attack executes
  recovery: number;   // How long before next attack
  range: number;      // Attack range
}

export interface ComboData {
  hits: number;
  multiplier: number;
  timeWindow: number;
}

// Base attack definitions
export const attacks: Record<string, Attack> = {
  punchHigh: {
    type: 'punch',
    height: 'high',
    damage: 12,
    speed: 0.2,
    recovery: 0.3,
    range: 1.5
  },
  
  punchLow: {
    type: 'punch', 
    height: 'low',
    damage: 10,
    speed: 0.15,
    recovery: 0.25,
    range: 1.3
  },
  
  kickHigh: {
    type: 'kick',
    height: 'high', 
    damage: 18,
    speed: 0.3,
    recovery: 0.4,
    range: 2.0
  },
  
  kickLow: {
    type: 'kick',
    height: 'low',
    damage: 15,
    speed: 0.25,
    recovery: 0.35,
    range: 1.8
  },
  
  special: {
    type: 'special',
    height: 'high',
    damage: 25,
    speed: 0.5,
    recovery: 0.8,
    range: 2.5
  }
};

// Calculate damage based on attacker stats and attack type
export function calculateDamage(
  attackType: AttackType,
  attackerStats: FighterStats,
  defenderStats?: FighterStats,
  comboMultiplier: number = 1
): number {
  const baseAttack = attacks[attackType] || attacks.punchHigh;
  
  // Base damage calculation
  let damage = baseAttack.damage;
  
  // Apply power multiplier
  const powerMultiplier = 0.5 + (attackerStats.power / 20);
  damage *= powerMultiplier;
  
  // Apply defender's defense if provided
  if (defenderStats) {
    const defenseReduction = defenderStats.defense / 20;
    damage *= (1 - defenseReduction);
  }
  
  // Apply combo multiplier
  damage *= comboMultiplier;
  
  // Add some randomness (±10%)
  const randomFactor = 0.9 + (Math.random() * 0.2);
  damage *= randomFactor;
  
  return Math.round(Math.max(1, damage));
}

// Calculate combo multiplier based on current combo count
export function getComboMultiplier(comboCount: number): number {
  if (comboCount < 2) return 1.0;
  if (comboCount < 4) return 1.2;
  if (comboCount < 6) return 1.4;
  if (comboCount < 8) return 1.6;
  return 1.8; // Max combo multiplier
}

// Check if an attack hits based on distance and timing
export function checkHit(
  attackerPos: { x: number; z: number },
  defenderPos: { x: number; z: number },
  attackType: AttackType,
  isBlocking: boolean = false
): {
  hit: boolean;
  damage: number;
  blocked: boolean;
} {
  const attack = attacks[attackType] || attacks.punchHigh;
  
  // Calculate distance
  const distance = Math.sqrt(
    Math.pow(attackerPos.x - defenderPos.x, 2) +
    Math.pow(attackerPos.z - defenderPos.z, 2)
  );
  
  const hit = distance <= attack.range;
  
  if (!hit) {
    return { hit: false, damage: 0, blocked: false };
  }
  
  // Check if attack is blocked
  const blocked = isBlocking && Math.random() > 0.3; // 70% block success rate
  
  let damage = attack.damage;
  if (blocked) {
    damage *= 0.2; // Blocked attacks do minimal damage
  }
  
  return { hit: true, damage: Math.round(damage), blocked };
}

// Determine attack effectiveness based on fighter styles
export function getAttackEffectiveness(
  attackType: AttackType,
  attackerStyle: string,
  defenderStyle: string
): number {
  // Style matchups - simplified rock-paper-scissors style
  const styleMatchups: Record<string, Record<string, number>> = {
    "Karate Master": {
      "Lightning Legs": 1.1,
      "Flame Fighter": 0.9,
      "Electric Beast": 1.0,
      "Grappler": 1.2,
      "Yoga Master": 1.1
    },
    "Lightning Legs": {
      "Karate Master": 0.9,
      "Flame Fighter": 1.1,
      "Electric Beast": 1.2,
      "Grappler": 0.8,
      "Yoga Master": 1.0
    },
    "Flame Fighter": {
      "Karate Master": 1.1,
      "Lightning Legs": 0.9,
      "Electric Beast": 0.8,
      "Grappler": 1.0,
      "Yoga Master": 1.2
    },
    // Add more matchups as needed
  };
  
  return styleMatchups[attackerStyle]?.[defenderStyle] || 1.0;
}

// Calculate energy drain from successful attacks
export function calculateEnergyDrain(damage: number, attackType: AttackType): number {
  let energyDrain = damage;
  
  // Different attack types drain energy differently
  switch (attackType) {
    case 'kick':
      energyDrain *= 1.2; // Kicks drain more energy
      break;
    case 'special':
      energyDrain *= 1.5; // Special moves drain much more
      break;
    default:
      energyDrain *= 1.0;
  }
  
  return Math.round(energyDrain);
}
