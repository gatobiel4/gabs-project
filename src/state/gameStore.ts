import { create } from 'zustand';
import type { FinalStats } from '../types/schemas';

export type SceneName = 'MainMenuScene' | 'WorldScene' | 'CharacterCreateScene';

interface GameState {
    // ── Scene ────────────────────────────────────────────────────
    currentScene: SceneName;
    setScene: (scene: SceneName) => void;

    // ── Character Selection ──────────────────────────────────────
    selectedRaceId: string | null;
    selectedClassId: string | null;
    finalStats: FinalStats | null;

    setSelectedRace: (raceId: string) => void;
    setSelectedClass: (classId: string) => void;
    setFinalStats: (stats: FinalStats) => void;
    resetCharacter: () => void;
}

export const useGameStore = create<GameState>((set) => ({
    // Scene
    currentScene: 'MainMenuScene',
    setScene: (scene) => set({ currentScene: scene }),

    // Character
    selectedRaceId: null,
    selectedClassId: null,
    finalStats: null,

    setSelectedRace: (raceId) => set({ selectedRaceId: raceId }),
    setSelectedClass: (classId) => set({ selectedClassId: classId }),
    setFinalStats: (stats) => set({ finalStats: stats }),
    resetCharacter: () => set({ selectedRaceId: null, selectedClassId: null, finalStats: null }),
}));
