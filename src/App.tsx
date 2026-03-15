import { useEffect } from 'react';
import { BabylonCanvas } from './app/BabylonCanvas';
import { useGameStore } from './state/gameStore';
import { MainMenuUI }       from './game/ui/MainMenuUI';
import { CharacterCreateUI } from './game/ui/CharacterCreateUI';
import { PauseMenuUI }      from './game/ui/PauseMenuUI';
import { HUD }              from './game/ui/HUD';
import { NotificationSystem } from './game/ui/NotificationSystem';
import { DebugWindow }      from './game/ui/DebugWindow';
import './App.css';

function App() {
  const { currentScene, isPaused, togglePause, toggleDebugMode } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC — toggle pause (WorldScene only)
      if (e.key === 'Escape' && currentScene === 'WorldScene') {
        togglePause();
      }
      // Backtick ` — toggle debug panel (any scene, dev only)
      if (e.key === '=') {
        toggleDebugMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScene, togglePause, toggleDebugMode]);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#000' }}>
      {/* The 3D Render Canvas is always active beneath the UI */}
      <BabylonCanvas />

      {/* RENDER MAIN MENU UI over the canvas if we are in the main menu scene state */}
      {currentScene === 'MainMenuScene' && <MainMenuUI />}

      {/* RENDER CHARACTER CREATION UI when in CharacterCreateScene */}
      {currentScene === 'CharacterCreateScene' && <CharacterCreateUI />}

      {/* RENDER HUD when in WorldScene (hidden while paused — pause menu covers it) */}
      {currentScene === 'WorldScene' && !isPaused && <HUD />}

      {/* RENDER PAUSE MENU when in WorldScene and paused */}
      {currentScene === 'WorldScene' && isPaused && <PauseMenuUI />}

      {/* NOTIFICATION SYSTEM — global, always visible across all scenes */}
      <NotificationSystem />

      {/* DEBUG PANEL — toggle with Backtick ` key */}
      <DebugWindow />
    </div>
  );
}

export default App;
