import { create } from 'zustand';

export type SceneName = 'MainMenuScene' | 'WorldScene' | 'CharacterCreateScene';

interface GameState {
    currentScene: SceneName;
    setScene: (scene: SceneName) => void;
}

export const useGameStore = create<GameState>((set) => ({
    currentScene: 'MainMenuScene',
    setScene: (scene: SceneName) => set({ currentScene: scene }),
}));
