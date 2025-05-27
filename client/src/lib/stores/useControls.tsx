import { create } from "zustand";

interface ControlMapping {
  forward: string;
  backward: string;
  leftward: string;
  rightward: string;
  punchHigh: string;
  punchLow: string;
  kickHigh: string;
  kickLow: string;
  block: string;
  special: string;
}

interface VirtualInputs {
  forward: boolean;
  backward: boolean;
  leftward: boolean;
  rightward: boolean;
  punchHigh: boolean;
  punchLow: boolean;
  kickHigh: boolean;
  kickLow: boolean;
  block: boolean;
  special: boolean;
}

interface ControlsState {
  // Control mappings for each player
  player1Controls: ControlMapping;
  player2Controls: ControlMapping;
  
  // Virtual inputs for touch controls
  virtualInputs: VirtualInputs;
  
  // Actions
  setVirtualInput: (input: string, active: boolean) => void;
  updateControlMapping: (player: 1 | 2, controls: Partial<ControlMapping>) => void;
}

const defaultVirtualInputs: VirtualInputs = {
  forward: false,
  backward: false,
  leftward: false,
  rightward: false,
  punchHigh: false,
  punchLow: false,
  kickHigh: false,
  kickLow: false,
  block: false,
  special: false
};

export const useControls = create<ControlsState>((set, get) => ({
  player1Controls: {
    forward: "forward",
    backward: "backward", 
    leftward: "leftward",
    rightward: "rightward",
    punchHigh: "punchHigh",
    punchLow: "punchLow",
    kickHigh: "kickHigh",
    kickLow: "kickLow",
    block: "block",
    special: "special"
  },
  
  player2Controls: {
    forward: "forward",
    backward: "backward",
    leftward: "leftward", 
    rightward: "rightward",
    punchHigh: "punchHigh",
    punchLow: "punchLow",
    kickHigh: "kickHigh",
    kickLow: "kickLow",
    block: "block",
    special: "special"
  },
  
  virtualInputs: { ...defaultVirtualInputs },
  
  setVirtualInput: (input: string, active: boolean) => {
    set((state) => ({
      virtualInputs: {
        ...state.virtualInputs,
        [input]: active
      }
    }));
  },
  
  updateControlMapping: (player: 1 | 2, controls: Partial<ControlMapping>) => {
    const playerKey = player === 1 ? 'player1Controls' : 'player2Controls';
    set((state) => ({
      [playerKey]: {
        ...state[playerKey],
        ...controls
      }
    }));
  }
}));
