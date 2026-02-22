import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../state/gameStore';

const GOLD = '#f5d76e';
const GOLD_D = 'rgba(245, 215, 110, 0.15)';
const BORDER = 'rgba(245, 215, 110, 0.3)';

export const PauseMenuUI: React.FC = () => {
    const { setPaused, setScene, resetCharacter } = useGameStore();
    const [showSettings, setShowSettings] = useState(false);
    const [visible, setVisible] = useState(false);

    // Fade-in on mount
    useEffect(() => {
        const t = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(t);
    }, []);

    const handleResume = () => {
        setVisible(false);
        setTimeout(() => setPaused(false), 200);
    };

    const handleQuitToMenu = () => {
        setVisible(false);
        setTimeout(() => {
            resetCharacter();
            setPaused(false);
            setScene('MainMenuScene');
        }, 200);
    };

    return (
        <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `rgba(0, 0, 0, ${visible ? 0.75 : 0})`,
            backdropFilter: visible ? 'blur(4px)' : 'none',
            transition: 'background 0.2s ease, backdrop-filter 0.2s ease',
            fontFamily: '"Vahika", "Cinzel", "Georgia", serif',
            zIndex: 100,
        }}>
            {/* ── Main Pause Panel ─────────────────────────────── */}
            <div style={{
                background: 'linear-gradient(160deg, rgba(8,8,18,0.97) 0%, rgba(16,10,28,0.97) 100%)',
                border: `1px solid ${BORDER}`,
                borderRadius: '4px',
                padding: '2.5rem 3rem',
                minWidth: '320px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem',
                boxShadow: `0 0 60px rgba(0,0,0,0.9), 0 0 20px rgba(245,215,110,0.08)`,
                transform: visible ? 'translateY(0)' : 'translateY(-20px)',
                opacity: visible ? 1 : 0,
                transition: 'transform 0.25s ease, opacity 0.25s ease',
            }}>
                {/* Title */}
                <div style={{
                    fontSize: '0.8rem', letterSpacing: '0.4em',
                    color: '#888', textTransform: 'uppercase', marginBottom: '0.5rem',
                }}>
                    ── Paused ──
                </div>
                <h2 style={{
                    fontSize: '2rem', color: GOLD, margin: '0 0 1.2rem 0',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    textShadow: `0 0 20px rgba(245,215,110,0.3)`,
                }}>
                    Chronicles of G
                </h2>

                {/* Buttons */}
                <PauseButton label="▶  Resume" onClick={handleResume} primary />
                <PauseButton label="⚙  Settings" onClick={() => setShowSettings(true)} />
                <PauseButton label="💾  Save Game" onClick={() => { }} disabled tooltip="Coming in Step 13" />
                <div style={{ width: '100%', borderTop: '1px solid #222', margin: '0.4rem 0' }} />
                <PauseButton label="⏎  Quit to Main Menu" onClick={handleQuitToMenu} danger />
            </div>

            {/* ── Settings Overlay ──────────────────────────────── */}
            {showSettings && (
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.6)',
                }}>
                    <div style={{
                        background: 'linear-gradient(160deg, rgba(8,8,18,0.98) 0%, rgba(16,10,28,0.98) 100%)',
                        border: `1px solid ${BORDER}`,
                        borderRadius: '4px',
                        padding: '2rem 2.5rem',
                        minWidth: '340px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                        boxShadow: `0 0 60px rgba(0,0,0,0.9)`,
                    }}>
                        <h3 style={{ color: GOLD, letterSpacing: '0.15em', margin: 0, textTransform: 'uppercase' }}>
                            Settings
                        </h3>
                        <p style={{ color: '#555', fontSize: '0.85rem', margin: 0, fontStyle: 'italic', textAlign: 'center' }}>
                            Audio, graphics, and controls settings<br />will be available in Step 15.
                        </p>
                        <button
                            onClick={() => setShowSettings(false)}
                            style={{
                                marginTop: '0.5rem',
                                padding: '0.6rem 2rem',
                                background: GOLD_D,
                                border: `1px solid ${GOLD}`,
                                color: GOLD, cursor: 'pointer',
                                fontFamily: 'inherit', fontSize: '0.9rem',
                                letterSpacing: '0.1em', textTransform: 'uppercase',
                                borderRadius: '3px',
                            }}
                        >
                            ← Back
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Sub-component ─────────────────────────────────────────────────────────────
interface PauseButtonProps {
    label: string;
    onClick: () => void;
    primary?: boolean;
    danger?: boolean;
    disabled?: boolean;
    tooltip?: string;
}

const PauseButton: React.FC<PauseButtonProps> = ({ label, onClick, primary, danger, disabled, tooltip }) => {
    const baseColor = danger ? '#c0392b' : primary ? GOLD : '#ccc';
    const baseBorder = danger ? 'rgba(192,57,43,0.4)' : primary ? BORDER : '#333';
    const baseGlow = danger ? 'rgba(192,57,43,0.2)' : primary ? 'rgba(245,215,110,0.15)' : 'transparent';

    return (
        <button
            onClick={disabled ? undefined : onClick}
            title={tooltip}
            style={{
                width: '100%',
                padding: '0.7rem 1rem',
                background: disabled ? 'transparent' : primary ? GOLD_D : 'transparent',
                border: `1px solid ${disabled ? '#2a2a2a' : baseBorder}`,
                borderRadius: '3px',
                color: disabled ? '#3a3a3a' : baseColor,
                fontFamily: '"Vahika", "Cinzel", serif',
                fontSize: '0.95rem',
                letterSpacing: '0.12em',
                cursor: disabled ? 'not-allowed' : 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                boxShadow: disabled ? 'none' : `0 0 10px ${baseGlow}`,
            }}
            onMouseEnter={e => {
                if (disabled) return;
                e.currentTarget.style.background = danger
                    ? 'rgba(192,57,43,0.15)' : primary
                        ? 'rgba(245,215,110,0.25)' : 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={e => {
                if (disabled) return;
                e.currentTarget.style.background = primary ? GOLD_D : 'transparent';
            }}
        >
            {label}
        </button>
    );
};
