import React, { useState } from 'react';
import { useGameStore } from '../../state/gameStore';
import { PlayerStatsTab }      from './debug/PlayerStatsTab';
import { SceneManagementTab }  from './debug/SceneManagementTab';
import { GameStateTab }        from './debug/GameStateTab';
import { EntityManagementTab } from './debug/EntityManagementTab';
import { CameraWorldTab }      from './debug/CameraWorldTab';
import { MovementSystemTab }   from './debug/MovementSystemTab';

// ─── Tab definition ───────────────────────────────────────────────────────────
type TabId = 'player' | 'scene' | 'state' | 'entities' | 'camera' | 'movement';

const TABS: { id: TabId; label: string; icon: string }[] = [
    { id: 'player',   label: 'Player',   icon: '⚔'  },
    { id: 'scene',    label: 'Scene',    icon: '◈'  },
    { id: 'state',    label: 'State',    icon: '◉'  },
    { id: 'entities', label: 'Entities', icon: '◌'  },
    { id: 'camera',   label: 'Camera',   icon: '⊙'  },
    { id: 'movement', label: 'Move',     icon: '►'  },
];

// ─── Colour constants ─────────────────────────────────────────────────────────
const WIN_BG     = 'rgba(10, 10, 18, 0.97)';
const WIN_BORDER = 'rgba(99, 102, 241, 0.55)';
const TITLE_BG   = 'rgba(99, 102, 241, 0.18)';
const TAB_ACTIVE = 'rgba(99, 102, 241, 0.28)';
const TAB_COLOR_ACTIVE   = '#a5b4fc';
const TAB_COLOR_INACTIVE = '#475569';
const TAB_BORDER = 'rgba(99, 102, 241, 0.25)';

// ─── DebugWindow ─────────────────────────────────────────────────────────────
export const DebugWindow: React.FC = () => {
    const { debugMode, toggleDebugMode } = useGameStore();
    const [activeTab,  setActiveTab]  = useState<TabId>('player');
    const [minimized,  setMinimized]  = useState(false);

    if (!debugMode) return null;

    return (
        <div
            style={{
                position: 'absolute',
                top: 10,
                right: 10,
                width: 410,
                maxHeight: minimized ? 'auto' : '92vh',
                background: WIN_BG,
                border: `1px solid ${WIN_BORDER}`,
                borderRadius: '6px',
                color: '#e2e8f0',
                fontFamily: 'monospace',
                fontSize: '12px',
                zIndex: 9999,
                boxShadow: '0 4px 32px rgba(0,0,0,0.85), 0 0 0 1px rgba(99,102,241,0.1)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                pointerEvents: 'auto',
            }}
        >
            {/* ── Title bar ──────────────────────────────────────── */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '5px 10px',
                background: TITLE_BG,
                borderBottom: `1px solid ${WIN_BORDER}`,
                userSelect: 'none',
            }}>
                <span style={{ color: '#a5b4fc', fontWeight: 700, letterSpacing: '0.06em', fontSize: '11px' }}>
                    DEBUG PANEL  &nbsp;<span style={{ color: '#475569', fontWeight: 400 }}>[ = ] to close</span>
                </span>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <TitleBtn onClick={() => setMinimized(m => !m)} color="#94a3b8" title={minimized ? 'Expand' : 'Minimize'}>
                        {minimized ? '▲' : '▼'}
                    </TitleBtn>
                    <TitleBtn onClick={toggleDebugMode} color="#ef4444" title="Close debug panel">✕</TitleBtn>
                </div>
            </div>

            {!minimized && (
                <>
                    {/* ── Tab bar ────────────────────────────────────── */}
                    <div style={{ display: 'flex', borderBottom: `1px solid ${TAB_BORDER}`, flexShrink: 0, overflow: 'hidden' }}>
                        {TABS.map((tab, idx) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        flex: 1,
                                        padding: '6px 2px',
                                        background: isActive ? TAB_ACTIVE : 'transparent',
                                        border: 'none',
                                        borderRight: idx < TABS.length - 1 ? `1px solid ${TAB_BORDER}` : 'none',
                                        borderBottom: isActive ? '2px solid #6366f1' : '2px solid transparent',
                                        color: isActive ? TAB_COLOR_ACTIVE : TAB_COLOR_INACTIVE,
                                        cursor: 'pointer',
                                        fontSize: '10px',
                                        fontFamily: 'monospace',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '1px',
                                        transition: 'color 0.15s, background 0.15s',
                                    }}
                                >
                                    <span style={{ fontSize: '13px' }}>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* ── Tab content ────────────────────────────────── */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '8px', scrollbarWidth: 'thin' }}>
                        {activeTab === 'player'   && <PlayerStatsTab />}
                        {activeTab === 'scene'    && <SceneManagementTab />}
                        {activeTab === 'state'    && <GameStateTab />}
                        {activeTab === 'entities' && <EntityManagementTab />}
                        {activeTab === 'camera'   && <CameraWorldTab />}
                        {activeTab === 'movement' && <MovementSystemTab />}
                    </div>
                </>
            )}
        </div>
    );
};

// ─── Small title-bar button ───────────────────────────────────────────────────
const TitleBtn: React.FC<{
    onClick: () => void;
    color: string;
    title?: string;
    children: React.ReactNode;
}> = ({ onClick, color, title, children }) => (
    <button
        onClick={onClick}
        title={title}
        style={{
            background: 'transparent',
            border: `1px solid ${color}60`,
            borderRadius: '3px',
            color,
            cursor: 'pointer',
            padding: '1px 7px',
            fontSize: '11px',
            fontFamily: 'monospace',
            lineHeight: '16px',
        }}
    >
        {children}
    </button>
);
