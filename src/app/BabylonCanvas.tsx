import React, { useEffect, useRef, useState } from 'react';
import { Engine } from '@babylonjs/core';
import { SceneManager } from '../game/engine/SceneManager';
import { createWorldScene } from '../game/scenes/WorldScene';
import { createCharacterCreateScene } from '../game/scenes/CharacterCreateScene';
import { createMainMenuScene } from '../game/scenes/MainMenuScene';
import { useGameStore } from '../state/gameStore';

export const BabylonCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [fps, setFps] = useState<number>(0);
    const currentSceneName = useGameStore((state) => state.currentScene);
    const sceneManagerRef = useRef<SceneManager | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const engine = new Engine(canvasRef.current, true, { preserveDrawingBuffer: true, stencil: true });

        // 6. Create SceneManager abstraction
        const sceneManager = new SceneManager(engine);
        sceneManagerRef.current = sceneManager;

        // Register our individual scenes
        sceneManager.registerScene('MainMenuScene', createMainMenuScene);
        sceneManager.registerScene('WorldScene', createWorldScene);
        sceneManager.registerScene('CharacterCreateScene', createCharacterCreateScene);

        // Initial scene
        sceneManager.switchToScene(currentSceneName);

        // Keep updating and re-drawing the current scene each frame
        engine.runRenderLoop(() => {
            sceneManager.render();
            setFps(Math.round(engine.getFps()));
        });

        const handleResize = () => {
            engine.resize();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            sceneManager.dispose();
            engine.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on mount

    // 7. Switch between scenes reacting to state change
    useEffect(() => {
        if (sceneManagerRef.current) {
            sceneManagerRef.current.switchToScene(currentSceneName);
        }
    }, [currentSceneName]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%', display: 'block', outline: 'none' }}
            />
            {/* FPS Counter Overlay */}
            <div style={{
                position: 'absolute',
                top: 10,
                left: 10,
                color: '#e5e7eb',
                background: 'rgba(0,0,0,0.6)',
                padding: '6px 12px',
                fontFamily: 'monospace',
                borderRadius: 8,
                pointerEvents: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
                ⏱ FPS: {fps}
            </div>
        </div>
    );
};
