import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../state/gameStore';

export const MainMenuUI: React.FC = () => {
    const { setScene } = useGameStore();
    const [hasStarted, setHasStarted] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // Listen for any keypress or click to transition from "Press Any Key" to the actual menu
    useEffect(() => {
        if (hasStarted) return;

        const handleStart = () => {
            setHasStarted(true);
            // Slight delay so the "Press Any Key" fades out before options appear
            setTimeout(() => setShowMenu(true), 800);
        };

        window.addEventListener('keydown', handleStart);
        window.addEventListener('mousedown', handleStart);

        return () => {
            window.removeEventListener('keydown', handleStart);
            window.removeEventListener('mousedown', handleStart);
        };
    }, [hasStarted]);

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: hasStarted ? 'auto' : 'none',
            color: '#eaeaea',
            fontFamily: '"Vahika", "Cinzel", "Georgia", serif', // Classic Fantasy font stack
            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
        }}>

            {/* 1. Main Game Title (Always stays on screen, but moves slightly when menu opens) */}
            <h1 style={{
                fontSize: '4.5rem',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                color: '#f5d76e', // Gold-ish title
                margin: '0 0 2rem 0',
                transition: 'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: hasStarted ? 'translateY(-10vh)' : 'translateY(10vh)',
                textShadow: '0 4px 10px rgba(0,0,0,0.8), 0 0 30px rgba(245, 215, 110, 0.4)',
                textTransform: 'uppercase'
            }}>
                Chronicles Of G
            </h1>

            {/* 2. OPTION C: "Press Any Key" - Fades out when clicked */}
            <div style={{
                opacity: hasStarted ? 0 : 1,
                transition: 'opacity 0.8s ease-out',
                position: 'absolute',
                top: '65%',
                fontSize: '1.2rem',
                letterSpacing: '0.2rem',
                animation: hasStarted ? 'none' : 'pulse 3s infinite',
                textTransform: 'uppercase',
                pointerEvents: 'none' // Ensure it doesn't block clicks when invisible
            }}>
                Press Any Key to Start
            </div>

            {/* 3. OPTION A: Classic Menu Options - Fades in AFTER "Press Any Key" finishes */}
            <div style={{
                // Hide main buttons if settings is open
                opacity: (showMenu && !showSettings) ? 1 : 0,
                transform: (showMenu && !showSettings) ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.5s ease-out',
                pointerEvents: (showMenu && !showSettings) ? 'auto' : 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                alignItems: 'center',
                marginTop: '-5vh'
            }}>
                <MenuButton onClick={() => setScene('CharacterCreateScene')}>New Game</MenuButton>
                {/* 
                  TODO Tracker: This 'Continue' button will be enabled when we actually implement Save/Load states 
                  later in the development plan (Step 13) 
                */}
                <MenuButton onClick={() => console.log('Load Menu')} disabled={true}>Continue</MenuButton>
                <MenuButton onClick={() => setShowSettings(true)}>Settings</MenuButton>
                {/* Quit is strictly for native desktop apps, so we disable it in browser */}
                <MenuButton onClick={() => console.log('Quit')} disabled={true}>Quit</MenuButton>
            </div>

            {/* 4. SETTINGS POPUP OVERLAY */}
            {showSettings && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '400px',
                    backgroundColor: 'rgba(10, 10, 15, 0.95)',
                    border: '1px solid rgba(245, 215, 110, 0.4)',
                    boxShadow: '0 0 30px rgba(0,0,0,0.9), inset 0 0 20px rgba(245, 215, 110, 0.05)',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '2rem',
                    zIndex: 100,
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <h2 style={{ color: '#f5d76e', fontSize: '2rem', letterSpacing: '0.1em', marginTop: 0, borderBottom: '1px solid rgba(245, 215, 110, 0.3)', paddingBottom: '1rem', width: '100%', textAlign: 'center' }}>
                        SETTINGS
                    </h2>

                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontStyle: 'italic' }}>
                        Settings configuration will be implemented in Step 15.
                    </div>

                    <MenuButton onClick={() => setShowSettings(false)}>Back</MenuButton>
                </div>
            )}

            <style>
                {`
          @keyframes pulse {
            0% { opacity: 0.4; }
            50% { opacity: 1; }
            100% { opacity: 0.4; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -45%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
          }
        `}
            </style>
        </div>
    );
};

// Reusable animated button for the Main Menu
const MenuButton = ({ children, onClick, disabled = false }: { children: React.ReactNode, onClick: () => void, disabled?: boolean }) => {
    const [isHovered, setIsHovered] = useState(false);

    // If disabled, ignore hover states and clicks
    const activeHover = isHovered && !disabled;

    return (
        <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={disabled ? undefined : onClick}
            style={{
                background: activeHover ? 'linear-gradient(90deg, transparent, rgba(245, 215, 110, 0.15), transparent)' : 'transparent',
                outline: 'none',
                border: 'none',
                borderTop: '1px solid transparent',
                borderBottom: '1px solid transparent',
                boxShadow: activeHover ? '0 -1px 0 rgba(245, 215, 110, 0.4), 0 1px 0 rgba(245, 215, 110, 0.4)' : 'none',
                color: disabled ? '#555' : (activeHover ? '#fff' : '#ccc'),
                padding: '0.8rem 4rem',
                fontSize: '1.4rem',
                fontFamily: 'inherit',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease',
                cursor: disabled ? 'not-allowed' : 'pointer',
                width: '100%',
                textShadow: disabled ? 'none' : (activeHover ? '0 0 10px rgba(255,255,255,0.8)' : '0 2px 4px rgba(0,0,0,0.8)'),
                opacity: disabled ? 0.6 : 1
            }}
        >
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '300px' }}>
                <span style={{ color: '#f5d76e', paddingRight: '15px', opacity: activeHover ? 1 : 0, transition: 'opacity 0.2s', width: '20px', textAlign: 'center' }}>✦</span>
                <span style={{ textAlign: 'center' }}>{children}</span>
                <span style={{ color: '#f5d76e', paddingLeft: '15px', opacity: activeHover ? 1 : 0, transition: 'opacity 0.2s', width: '20px', textAlign: 'center' }}>✦</span>
            </span>
        </button>
    );
};
