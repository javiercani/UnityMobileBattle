import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { fighters as fighterData, accessories } from "../game/fighters";
import { calculateDamage, AttackType } from "../game/combat";

export type GamePhase = "menu" | "character_selection" | "fighting" | "round_end" | "match_end";

interface Fighter {
  id: number;
  name: string;
  characterId: string;
  emoji: string;
  position: { x: number; y: number; z: number };
  energy: number;
  isAttacking: boolean;
  isMoving: boolean;
  lastAttackTime: number;
  combo: number;
  accessory?: string;
}

interface HitEffect {
  active: boolean;
  startTime: number;
}

interface FightingState {
  gamePhase: GamePhase;
  fighters: Record<number, Fighter>;
  hitEffects: Record<number, HitEffect>;
  gameTimer: number;
  roundTimer: number;
  winner: number | null;
  scores: Record<number, number>;
  
  // Actions
  startCharacterSelection: () => void;
  setSelectedCharacters: (char1: string, char2: string) => void;
  startFight: () => void;
  updateFighterPosition: (id: number, x: number, y: number, z: number, isMoving: boolean) => void;
  performAttack: (attackerId: number, attackType: string) => void;
  checkCollision: (attackerId: number, defenderId: number) => void;
  endRound: () => void;
  resetGame: () => void;
}

export const useFighting = create<FightingState>()(
  subscribeWithSelector((set, get) => ({
    gamePhase: "menu",
    fighters: {},
    hitEffects: {},
    gameTimer: 60,
    roundTimer: 0,
    winner: null,
    scores: { 1: 0, 2: 0 },

    startCharacterSelection: () => {
      set({ gamePhase: "character_selection" });
    },

    setSelectedCharacters: (char1: string, char2: string) => {
      const fighter1Data = fighterData[char1];
      const fighter2Data = fighterData[char2];
      
      set({
        fighters: {
          1: {
            id: 1,
            name: fighter1Data.name,
            characterId: char1,
            emoji: fighter1Data.emoji,
            position: { x: -4, y: 0, z: 0 },
            energy: 100,
            isAttacking: false,
            isMoving: false,
            lastAttackTime: 0,
            combo: 0,
            accessory: fighter1Data.accessory ? fighter1Data.accessory : undefined
          },
          2: {
            id: 2,
            name: fighter2Data.name,
            characterId: char2,
            emoji: fighter2Data.emoji,
            position: { x: 4, y: 0, z: 0 },
            energy: 100,
            isAttacking: false,
            isMoving: false,
            lastAttackTime: 0,
            combo: 0,
            accessory: fighter2Data.accessory ? fighter2Data.accessory : undefined
          }
        },
        hitEffects: {
          1: { active: false, startTime: 0 },
          2: { active: false, startTime: 0 }
        }
      });
    },

    startFight: () => {
      set({ 
        gamePhase: "fighting",
        gameTimer: 60,
        roundTimer: 0,
        winner: null
      });
      
      // Start game timer
      const timer = setInterval(() => {
        const state = get();
        if (state.gamePhase === "fighting") {
          const newTimer = state.gameTimer - 0.1;
          if (newTimer <= 0) {
            clearInterval(timer);
            get().endRound();
          } else {
            set({ gameTimer: newTimer });
          }
        } else {
          clearInterval(timer);
        }
      }, 100);
    },

    updateFighterPosition: (id: number, x: number, y: number, z: number, isMoving: boolean) => {
      set((state) => ({
        fighters: {
          ...state.fighters,
          [id]: {
            ...state.fighters[id],
            position: { x, y, z },
            isMoving
          }
        }
      }));
    },

    performAttack: (attackerId: number, attackType: string) => {
      const state = get();
      const fighter = state.fighters[attackerId];
      if (!fighter || fighter.isAttacking) return;

      const now = Date.now();
      if (now - fighter.lastAttackTime < 300) return; // Attack cooldown

      set((state) => ({
        fighters: {
          ...state.fighters,
          [attackerId]: {
            ...state.fighters[attackerId],
            isAttacking: true,
            lastAttackTime: now
          }
        }
      }));

      // Reset attack state after animation
      setTimeout(() => {
        set((state) => ({
          fighters: {
            ...state.fighters,
            [attackerId]: {
              ...state.fighters[attackerId],
              isAttacking: false
            }
          }
        }));
      }, 300);
    },

    checkCollision: (attackerId: number, defenderId: number) => {
      const state = get();
      const attacker = state.fighters[attackerId];
      const defender = state.fighters[defenderId];
      
      if (!attacker || !defender) return;

      const distance = Math.sqrt(
        Math.pow(attacker.position.x - defender.position.x, 2) +
        Math.pow(attacker.position.z - defender.position.z, 2)
      );

      if (distance < 2.5) {
        const attackerData = fighterData[attacker.characterId];
        const accessoryPower = attacker.accessory ? accessories[attacker.accessory].power : 0;
        const damage = calculateDamage('punch' as AttackType, attackerData.stats, undefined, undefined, accessoryPower);
        
        const newEnergy = Math.max(0, defender.energy - damage);
        const newCombo = attacker.combo + 1;
        
        set((state) => ({
          fighters: {
            ...state.fighters,
            [defenderId]: {
              ...state.fighters[defenderId],
              energy: newEnergy
            },
            [attackerId]: {
              ...state.fighters[attackerId],
              combo: newCombo
            }
          },
          hitEffects: {
            ...state.hitEffects,
            [defenderId]: {
              active: true,
              startTime: Date.now()
            }
          },
          scores: {
            ...state.scores,
            [attackerId]: state.scores[attackerId] + Math.round(damage)
          }
        }));

        // Clear hit effect after duration
        setTimeout(() => {
          set((state) => ({
            hitEffects: {
              ...state.hitEffects,
              [defenderId]: {
                ...state.hitEffects[defenderId],
                active: false
              }
            }
          }));
        }, 200);

        // Check for knockout
        if (newEnergy <= 0) {
          get().endRound();
        }
      }
    },

    endRound: () => {
      const state = get();
      let winner = null;
      
      if (state.fighters[1]?.energy <= 0) {
        winner = 2;
      } else if (state.fighters[2]?.energy <= 0) {
        winner = 1;
      } else {
        // Time's up - winner based on remaining energy
        if (state.fighters[1]?.energy > state.fighters[2]?.energy) {
          winner = 1;
        } else if (state.fighters[2]?.energy > state.fighters[1]?.energy) {
          winner = 2;
        }
      }

      set({ 
        gamePhase: "round_end", 
        winner 
      });

      // Transition to match end after showing round result
      setTimeout(() => {
        set({ gamePhase: "match_end" });
      }, 2000);
    },

    resetGame: () => {
      const state = get();
      // Reset energy but keep same characters
      set({
        gamePhase: "fighting",
        gameTimer: 60,
        winner: null,
        fighters: {
          1: {
            ...state.fighters[1],
            energy: 100,
            position: { x: -4, y: 0, z: 0 },
            isAttacking: false,
            isMoving: false,
            combo: 0
          },
          2: {
            ...state.fighters[2],
            energy: 100,
            position: { x: 4, y: 0, z: 0 },
            isAttacking: false,
            isMoving: false,
            combo: 0
          }
        },
        hitEffects: {
          1: { active: false, startTime: 0 },
          2: { active: false, startTime: 0 }
        }
      });
      
      // Restart timer
      get().startFight();
    }
  }))
);
