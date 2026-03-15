import React from 'react';
import { useGameStore } from '../../state/gameStore';

// ─── Colour Tokens (matching existing UI) ────────────────────────────────────
const GOLD   = '#f5d76e';
const PANEL  = 'rgba(10, 10, 18, 0.92)';
const BORDER = 'rgba(245, 215, 110, 0.3)';
const FONT   = '"Vahika", "Cinzel", "Georgia", serif';

// ─── Bar colour definitions ───────────────────────────────────────────────────
const HP_COLOR  = '#c0392b';   // deep red
const HP_GLOW   = 'rgba(192, 57, 43, 0.4)';
const MP_COLOR  = '#1a6fa3';   // rich blue
const MP_GLOW   = 'rgba(26, 111, 163, 0.4)';
const XP_COLOR  = '#b8860b';   // dark gold
const XP_GLOW   = 'rgba(184, 134, 11, 0.35)';

// ─── StatusBar ────────────────────────────────────────────────────────────────
interface StatusBarProps {
    label: string;
    current: number;
    max: number;
    barColor: string;
    glowColor: string;
    icon: string;
    iconColor: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ label, current, max, barColor, glowColor, icon, iconColor }) => {
    const pct = Math.min(Math.max((current / max) * 100, 0), 100);

    // Low threshold — pulse icon when below 20%
    const isLow = pct <= 20;

    return (
        <div style={{ marginBottom: '0.75rem', width: '100%' }}>
            {/* Label row */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '3px',
            }}>
                <span style={{
                    fontFamily: FONT,
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: GOLD,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                }}>
                    <span style={{
                        color: iconColor,
                        fontSize: '0.9rem',
                        animation: isLow ? 'hudPulse 1s infinite' : 'none',
                    }}>
                        {icon}
                    </span>
                    {label}
                </span>
                <span style={{
                    fontFamily: 'monospace',
                    fontSize: '0.7rem',
                    color: '#aaa',
                    letterSpacing: '0.05em',
                }}>
                    {current} / {max}
                </span>
            </div>

            {/* Bar track */}
            <div style={{
                width: '100%',
                height: '10px',
                background: 'rgba(0, 0, 0, 0.6)',
                border: `1px solid ${BORDER}`,
                overflow: 'hidden',
                position: 'relative',
            }}>
                {/* Filled portion */}
                <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: barColor,
                    boxShadow: `0 0 6px ${glowColor}`,
                    transition: 'width 0.25s ease-out',
                }} />
            </div>
        </div>
    );
};

// ─── HUD ─────────────────────────────────────────────────────────────────────
export const HUD: React.FC = () => {
    const playerStats = useGameStore((s) => s.playerStats);
    const playerName  = useGameStore((s) => s.playerName);

    if (!playerStats) return null;

    return (
        <div style={{
            position: 'absolute',
            top: '1.5rem',
            left: '1.5rem',
            pointerEvents: 'none',         // clicks pass through to the 3D canvas
            zIndex: 20,
        }}>
            {/* Panel */}
            <div style={{
                position: 'relative',
                background: PANEL,
                border: `1px solid ${BORDER}`,
                boxShadow: `0 0 24px rgba(0,0,0,0.8), inset 0 0 16px rgba(245,215,110,0.03)`,
                padding: '1rem 1.1rem',
                minWidth: '220px',
                maxWidth: '260px',
                fontFamily: FONT,
            }}>
                {/* Decorative corner diamonds */}
                <span style={{ position: 'absolute', top: '4px',  left: '5px',  color: GOLD, fontSize: '0.55rem', opacity: 0.7 }}>♦</span>
                <span style={{ position: 'absolute', top: '4px',  right: '5px', color: GOLD, fontSize: '0.55rem', opacity: 0.7 }}>♦</span>
                <span style={{ position: 'absolute', bottom: '4px', left: '5px', color: GOLD, fontSize: '0.55rem', opacity: 0.7 }}>♦</span>
                <span style={{ position: 'absolute', bottom: '4px', right: '5px', color: GOLD, fontSize: '0.55rem', opacity: 0.7 }}>♦</span>

                {/* Avatar row: Level badge + Player name */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    marginBottom: '0.85rem',
                    borderBottom: `1px solid ${BORDER}`,
                    paddingBottom: '0.65rem',
                }}>
                    {/* Level badge */}
                    <div style={{
                        width: '36px',
                        height: '36px',
                        flexShrink: 0,
                        background: 'rgba(245, 215, 110, 0.1)',
                        border: `1px solid ${BORDER}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                    }}>
                        <span style={{ color: '#888', fontSize: '0.45rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>LVL</span>
                        <span style={{ color: GOLD, fontSize: '0.9rem', fontWeight: 700, lineHeight: 1 }}>{playerStats.level}</span>
                    </div>

                    {/* Name */}
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{
                            color: '#eaeaea',
                            fontSize: '0.95rem',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textShadow: `0 0 8px rgba(245,215,110,0.2)`,
                        }}>
                            {playerName}
                        </div>
                        <div style={{ color: '#555', fontSize: '0.6rem', letterSpacing: '0.1em' }}>Adventurer</div>
                    </div>
                </div>

                {/* Status Bars */}
                <StatusBar
                    label="Vitality"
                    current={playerStats.hp}
                    max={playerStats.maxHp}
                    barColor={HP_COLOR}
                    glowColor={HP_GLOW}
                    icon="❤"
                    iconColor="#e74c3c"
                />
                <StatusBar
                    label="Essence"
                    current={playerStats.mp}
                    max={playerStats.maxMp}
                    barColor={MP_COLOR}
                    glowColor={MP_GLOW}
                    icon="✦"
                    iconColor="#3498db"
                />
                <StatusBar
                    label="Experience"
                    current={playerStats.xp}
                    max={playerStats.maxXp}
                    barColor={XP_COLOR}
                    glowColor={XP_GLOW}
                    icon="⭐"
                    iconColor={GOLD}
                />
            </div>

            {/* Keyframe animations */}
            <style>{`
                @keyframes hudPulse {
                    0%   { opacity: 1; }
                    50%  { opacity: 0.3; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};
