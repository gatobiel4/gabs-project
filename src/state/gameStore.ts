import { create } from 'zustand';
import type { FinalStats } from '../types/schemas';
import type { PlayerStats } from '../game/entities/Player';

export type SceneName = 'MainMenuScene' | 'WorldScene' | 'CharacterCreateScene';

interface GameState {
    // ── Scene ────────────────────────────────────────────────────
    currentScene: SceneName;
    setScene: (scene: SceneName) => void;

    // ── Pause ────────────────────────────────────────────────────
    isPaused: boolean;
    setPaused: (value: boolean) => void;
    togglePause: () => void;

    // ── Character Selection ──────────────────────────────────────
    selectedRaceId: string | null;
    selectedClassId: string | null;
    finalStats: FinalStats | null;

    setSelectedRace: (raceId: string) => void;
    setSelectedClass: (classId: string) => void;
    setFinalStats: (stats: FinalStats) => void;
    resetCharacter: () => void;

    // ── Player Runtime State (HUD) ───────────────────────────────
    playerStats: PlayerStats | null;
    setPlayerStats: (stats: PlayerStats) => void;

    playerName: string;
    setPlayerName: (name: string) => void;

    // ── Notifications ────────────────────────────────────────────
    notifications: NotificationEntry[];
    addNotification: (message: string, type: NotificationType, duration?: number) => void;
    removeNotification: (id: string) => void;

    // ── Debug ────────────────────────────────────────────────────
    debugMode: boolean;
    setDebugMode: (value: boolean) => void;
    toggleDebugMode: () => void;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface NotificationEntry {
    id: string;
    message: string;
    type: NotificationType;
    duration: number;
}

export const useGameStore = create<GameState>((set) => ({
    // Scene
    currentScene: 'MainMenuScene',
    setScene: (scene) => set({ currentScene: scene }),

    // Pause
    isPaused: false,
    setPaused: (value) => set({ isPaused: value }),
    togglePause: () => set((state) => ({ isPaused: !state.isPaused })),

    // Character
    selectedRaceId: null,
    selectedClassId: null,
    finalStats: null,

    setSelectedRace: (raceId) => set({ selectedRaceId: raceId }),
    setSelectedClass: (classId) => set({ selectedClassId: classId }),
    setFinalStats: (stats) => set({ finalStats: stats }),
    resetCharacter: () => set({ selectedRaceId: null, selectedClassId: null, finalStats: null }),

    // Player Runtime State (HUD)
    playerStats: null,
    setPlayerStats: (stats) => set({ playerStats: stats }),

    playerName: 'Adventurer',
    setPlayerName: (name) => set({ playerName: name }),

    // Notifications
    notifications: [],
    addNotification: (message, type, duration = 3000) =>
        set((state) => ({
            notifications: [
                ...state.notifications.slice(-4), // Keep max 5
                { id: `${Date.now()}-${Math.random()}`, message, type, duration },
            ],
        })),
    removeNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),

    // Debug
    debugMode: false,
    setDebugMode: (value) => set({ debugMode: value }),
    toggleDebugMode: () => set((state) => ({ debugMode: !state.debugMode })),
}));
