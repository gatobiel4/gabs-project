import { BabylonCanvas } from './app/BabylonCanvas';
import { useGameStore } from './state/gameStore';
import { MainMenuUI } from './game/ui/MainMenuUI';
import './App.css';

function App() {
  const { currentScene, setScene } = useGameStore();

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#000' }}>
      {/* The 3D Render Canvas is always active beneath the UI */}
      <BabylonCanvas />

      {/* RENDER MAIN MENU UI over the canvas if we are in the main menu scene state */}
      {currentScene === 'MainMenuScene' && <MainMenuUI />}

      {/* UI Overlay to test scene switching (Temp Debugger) */}
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        background: 'rgba(0,0,0,0.7)',
        padding: '10px',
        borderRadius: '8px',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontFamily: 'Inter, sans-serif',
        zIndex: 9999
      }}>
        <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
          Current Scene: <span style={{ color: '#646cff' }}>{currentScene}</span>
        </div>
        <button onClick={() => setScene('MainMenuScene')} style={{ cursor: 'pointer', padding: '6px 12px' }}>
          Load Main Menu
        </button>
        <button onClick={() => setScene('WorldScene')} style={{ cursor: 'pointer', padding: '6px 12px' }}>
          Load World Scene
        </button>
        <button onClick={() => setScene('CharacterCreateScene')} style={{ cursor: 'pointer', padding: '6px 12px' }}>
          Load Character Create Scene
        </button>
      </div>
    </div>
  );
}

export default App;
