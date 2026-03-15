import React from 'react';
import { useGameStore } from '../../../state/gameStore';
import { debugRegistry } from '../../debug/debugRegistry';
import {
    Section, Row,
    useDebugPoll, D_GOOD, D_WARN, D_VALUE,
} from './debugUtils';

export const SceneManagementTab: React.FC = () => {
    useDebugPoll(300);

    const { currentScene, setScene, isPaused } = useGameStore();

    const fps     = debugRegistry.scene ? Math.round(debugRegistry.scene.getEngine().getFps()) : 0;
    const meshes  = debugRegistry.scene?.meshes.length ?? 0;
    const lights  = debugRegistry.scene?.lights.length ?? 0;
    const entities = debugRegistry.movementSystem?.getEntities().size ?? 0;

    const fpsColor = fps >= 50 ? D_GOOD : fps >= 30 ? D_WARN : '#f87171';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>

            {/* Current State */}
            <Section title="Current State">
                <Row label="Active Scene"  value={currentScene} valueColor={D_VALUE} />
                <Row label="Paused"        value={isPaused ? 'YES' : 'no'} valueColor={isPaused ? D_WARN : D_GOOD} />
                <Row label="FPS"           value={String(fps)} valueColor={fpsColor} />
            </Section>

            {/* Scene Stats (WorldScene only) */}
            <Section title="Scene Stats">
                {debugRegistry.scene ? (
                    <>
                        <Row label="Meshes"        value={String(meshes)} />
                        <Row label="Lights"        value={String(lights)} />
                        <Row label="Entities"      value={String(entities)} />
                    </>
                ) : (
                    <div style={{ color: '#64748b', fontSize: '11px', padding: '4px 0' }}>
                        No WorldScene active
                    </div>
                )}
            </Section>

            {/* Scene Switcher */}
            <Section title="Scene Switcher">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <SceneBtn current={currentScene} target="MainMenuScene"       label="Main Menu"          setScene={setScene} />
                    <SceneBtn current={currentScene} target="CharacterCreateScene" label="Character Creation" setScene={setScene} />
                    <SceneBtn current={currentScene} target="WorldScene"           label="World Scene"        setScene={setScene} />
                </div>
            </Section>

        </div>
    );
};

const SceneBtn: React.FC<{
    current: string;
    target: string;
    label: string;
    setScene: (s: any) => void;
}> = ({ current, target, label, setScene }) => {
    const isActive = current === target;
    return (
        <button
            onClick={() => { if (!isActive) setScene(target); }}
            style={{
                background: isActive ? 'rgba(99,102,241,0.25)' : 'rgba(30,30,50,0.6)',
                border: `1px solid ${isActive ? '#6366f1' : '#334155'}`,
                borderRadius: '4px',
                color: isActive ? '#a5b4fc' : '#94a3b8',
                padding: '5px 8px',
                fontSize: '11px',
                fontFamily: 'monospace',
                cursor: isActive ? 'default' : 'pointer',
                textAlign: 'left',
            }}
        >
            {isActive ? '► ' : '  '}{label}
            {isActive && <span style={{ float: 'right', color: D_GOOD }}>ACTIVE</span>}
        </button>
    );
};
