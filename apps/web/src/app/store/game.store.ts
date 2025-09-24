import { create } from "zustand";
import type { GameConfig } from "@tiktok/types";

interface GameState {
  selected?: GameConfig;
  totalRounds: number;
  currentRound: number;
  setGame: (g: GameConfig) => void;
  nextRound: () => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  selected: undefined,
  totalRounds: 0,
  currentRound: 0,
  setGame: (g) =>
    set({ selected: g, totalRounds: g.defaultRounds, currentRound: 1 }),
  nextRound: () =>
    set((s) => ({ currentRound: Math.min(s.currentRound + 1, s.totalRounds) })),
  reset: () => set({ selected: undefined, totalRounds: 0, currentRound: 0 }),
}));
