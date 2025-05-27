export interface FighterStats {
  speed: number;    // 1-10
  power: number;    // 1-10
  defense: number;  // 1-10
  energy: number;   // Starting energy
}

export interface FighterData {
  name: string;
  style: string;
  emoji: string;
  color: string;
  stats: FighterStats;
  specialMoves: string[];
}

export const fighters: Record<string, FighterData> = {
  ryu: {
    name: "Ryu",
    style: "Karate Master",
    emoji: "🥋",
    color: "#FFFFFF",
    stats: {
      speed: 7,
      power: 8,
      defense: 7,
      energy: 100
    },
    specialMoves: ["Hadoken", "Shoryuken", "Tatsumaki"]
  },
  
  chun: {
    name: "Chun-Li",
    style: "Lightning Legs",
    emoji: "⚡",
    color: "#0066CC",
    stats: {
      speed: 9,
      power: 6,
      defense: 6,
      energy: 100
    },
    specialMoves: ["Lightning Legs", "Spinning Bird Kick", "Kikoken"]
  },
  
  ken: {
    name: "Ken",
    style: "Flame Fighter",
    emoji: "🔥",
    color: "#FFD700",
    stats: {
      speed: 8,
      power: 7,
      defense: 6,
      energy: 100
    },
    specialMoves: ["Fire Shoryuken", "Hurricane Kick", "Fire Hadoken"]
  },
  
  blanka: {
    name: "Blanka",
    style: "Electric Beast",
    emoji: "⚡",
    color: "#00FF00",
    stats: {
      speed: 6,
      power: 9,
      defense: 8,
      energy: 100
    },
    specialMoves: ["Electric Thunder", "Rolling Attack", "Beast Roll"]
  },
  
  zangief: {
    name: "Zangief",
    style: "Grappler",
    emoji: "💪",
    color: "#FF4444",
    stats: {
      speed: 4,
      power: 10,
      defense: 9,
      energy: 100
    },
    specialMoves: ["Screw Piledriver", "Lariat", "Bear Hug"]
  },
  
  dhalsim: {
    name: "Dhalsim",
    style: "Yoga Master",
    emoji: "🧘",
    color: "#FF8800",
    stats: {
      speed: 5,
      power: 7,
      defense: 5,
      energy: 100
    },
    specialMoves: ["Yoga Fire", "Yoga Teleport", "Stretch Punch"]
  }
};

// Helper function to get random fighter
export function getRandomFighter(): string {
  const fighterIds = Object.keys(fighters);
  return fighterIds[Math.floor(Math.random() * fighterIds.length)];
}

// Helper function to get fighter by ID with fallback
export function getFighter(id: string): FighterData {
  return fighters[id] || fighters.ryu;
}

// Helper function to calculate fighter effectiveness
export function calculateMatchup(fighter1Id: string, fighter2Id: string): {
  advantage: number; // -1 to 1, where 1 means fighter1 has advantage
  description: string;
} {
  const f1 = getFighter(fighter1Id);
  const f2 = getFighter(fighter2Id);
  
  // Simple effectiveness calculation based on stats
  const f1Total = f1.stats.speed + f1.stats.power + f1.stats.defense;
  const f2Total = f2.stats.speed + f2.stats.power + f2.stats.defense;
  
  const advantage = Math.max(-1, Math.min(1, (f1Total - f2Total) / 30));
  
  let description = "Even match";
  if (advantage > 0.3) description = `${f1.name} has the advantage`;
  else if (advantage < -0.3) description = `${f2.name} has the advantage`;
  
  return { advantage, description };
}
