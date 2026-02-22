import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../state/gameStore';
import { DataLoader } from '../data/DataLoader';
import { CharacterFactory } from '../data/CharacterFactory';
import { type Race, type CharacterClass } from '../../types/schemas';

// ─── Colour Tokens ────────────────────────────────────────────────────────────
const GOLD = '#f5d76e';
const GOLD_D = 'rgba(245, 215, 110, 0.15)';
const PANEL = 'rgba(10, 10, 18, 0.92)';
const BORDER = 'rgba(245, 215, 110, 0.3)';

export const CharacterCreateUI: React.FC = () => {
    const { setScene, setSelectedRace, setSelectedClass, setFinalStats } = useGameStore();

    // Data
    const [races, setRaces] = useState<Race[]>([]);
    const [classes, setClasses] = useState<CharacterClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Selections
    const [selectedRace, setRace] = useState<Race | null>(null);
    const [selectedClass, setClass] = useState<CharacterClass | null>(null);

    // Load JSON data on mount
    useEffect(() => {
        DataLoader.loadAll()
            .then(({ races, classes }) => {
                setRaces(races);
                setClasses(classes);
                setRace(races[0]);
                setClass(classes[0]);
                setLoading(false);
            })
            .catch(err => {
                setError(`Failed to load data: ${err.message}`);
                setLoading(false);
            });
    }, []);

    // Recompute stats whenever selection changes
    const finalStats = selectedRace && selectedClass
        ? CharacterFactory.build(selectedRace, selectedClass)
        : null;

    const handleBeginAdventure = () => {
        if (!selectedRace || !selectedClass || !finalStats) return;
        setSelectedRace(selectedRace.id);
        setSelectedClass(selectedClass.id);
        setFinalStats(finalStats);
        setScene('WorldScene');
    };

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorScreen message={error} onBack={() => setScene('MainMenuScene')} />;

    const statPreview = finalStats ? CharacterFactory.preview(selectedRace!, selectedClass!) : {};

    return (
        <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            fontFamily: '"Vahika", "Cinzel", "Georgia", serif',
            color: '#eaeaea',
            background: 'linear-gradient(160deg, rgba(5,5,12,0.97) 0%, rgba(15,10,25,0.97) 100%)',
            overflow: 'hidden',
        }}>
            {/* ── Title ─────────────────────────────────────────────────────── */}
            <h1 style={{
                fontSize: '2.2rem', letterSpacing: '0.15em', color: GOLD,
                textShadow: `0 0 20px rgba(245,215,110,0.4)`,
                margin: '0 0 1.5rem 0', textTransform: 'uppercase',
            }}>
                Choose Your Path
            </h1>

            {/* ── Three-column layout ───────────────────────────────────────── */}
            <div style={{ display: 'flex', gap: '1.5rem', width: '90%', maxWidth: '1100px', flex: 1, maxHeight: '65vh' }}>

                {/* LEFT — Race Selector */}
                <SelectorPanel
                    title="Race"
                    items={races}
                    selectedId={selectedRace?.id ?? null}
                    onSelect={(item) => setRace(item as Race)}
                    renderDescription={(item) => (item as Race).bonusDescription}
                    renderDetail={(item) => (item as Race).description}
                />

                {/* CENTRE — Stats Preview */}
                <div style={{
                    flex: 1, background: PANEL, border: `1px solid ${BORDER}`,
                    borderRadius: '4px', padding: '1.5rem',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    boxShadow: `0 0 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(245,215,110,0.03)`,
                    minWidth: '240px',
                }}>
                    <h2 style={{ color: GOLD, fontSize: '1.1rem', letterSpacing: '0.1em', margin: '0 0 1rem 0' }}>
                        CHARACTER STATS
                    </h2>
                    <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '1.5rem', textAlign: 'center', fontStyle: 'italic' }}>
                        {selectedRace?.name} · {selectedClass?.name}
                    </div>

                    <div style={{ width: '100%', flex: 1, overflowY: 'auto' }}>
                        {Object.entries(statPreview).map(([stat, value]) => (
                            <StatRow key={stat} label={stat} value={value} />
                        ))}
                    </div>

                    <button
                        onClick={handleBeginAdventure}
                        disabled={!selectedRace || !selectedClass}
                        style={{
                            marginTop: '1.5rem',
                            width: '100%',
                            padding: '0.9rem',
                            background: (!selectedRace || !selectedClass)
                                ? 'rgba(50,50,50,0.5)'
                                : `linear-gradient(135deg, rgba(180,130,30,0.6), rgba(245,215,110,0.3))`,
                            border: `1px solid ${(!selectedRace || !selectedClass) ? '#333' : GOLD}`,
                            borderRadius: '3px',
                            color: (!selectedRace || !selectedClass) ? '#555' : '#fff',
                            fontFamily: 'inherit',
                            fontSize: '1rem',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            cursor: (!selectedRace || !selectedClass) ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: (!selectedRace || !selectedClass) ? 'none' : `0 0 15px rgba(245,215,110,0.3)`,
                        }}
                    >
                        ⚔ Begin Adventure
                    </button>

                    <button
                        onClick={() => setScene('MainMenuScene')}
                        style={{
                            marginTop: '0.7rem', width: '100%', padding: '0.6rem',
                            background: 'transparent', border: '1px solid #333',
                            color: '#666', fontFamily: 'inherit', fontSize: '0.85rem',
                            letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                            borderRadius: '3px', transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#aaa')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#666')}
                    >
                        ← Back to Menu
                    </button>
                </div>

                {/* RIGHT — Class Selector */}
                <SelectorPanel
                    title="Class"
                    items={classes}
                    selectedId={selectedClass?.id ?? null}
                    onSelect={(item) => setClass(item as CharacterClass)}
                    renderDescription={(item) => (item as CharacterClass).bonusDescription}
                    renderDetail={(item) => (item as CharacterClass).description}
                />
            </div>

            <style>{`
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .char-screen { animation: fadeSlideIn 0.6s ease-out; }
            `}</style>
        </div>
    );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SelectorPanelProps {
    title: string;
    items: { id: string; name: string }[];
    selectedId: string | null;
    onSelect: (item: { id: string; name: string }) => void;
    renderDescription: (item: { id: string; name: string }) => string;
    renderDetail: (item: { id: string; name: string }) => string;
}

const SelectorPanel: React.FC<SelectorPanelProps> = ({
    title, items, selectedId, onSelect, renderDescription, renderDetail,
}) => {
    const selected = items.find(i => i.id === selectedId) ?? null;

    return (
        <div style={{
            width: '280px', flexShrink: 0,
            background: PANEL, border: `1px solid ${BORDER}`,
            borderRadius: '4px', padding: '1.2rem',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 0 30px rgba(0,0,0,0.8)',
        }}>
            <h2 style={{ color: GOLD, fontSize: '1.1rem', letterSpacing: '0.1em', margin: '0 0 1rem 0', textAlign: 'center' }}>
                {title.toUpperCase()}
            </h2>

            {/* Option list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                {items.map(item => {
                    const isSelected = item.id === selectedId;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item)}
                            style={{
                                background: isSelected ? GOLD_D : 'transparent',
                                border: `1px solid ${isSelected ? GOLD : '#333'}`,
                                borderRadius: '3px',
                                color: isSelected ? GOLD : '#ccc',
                                padding: '0.6rem 1rem',
                                fontFamily: 'inherit',
                                fontSize: '1rem',
                                letterSpacing: '0.1em',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s ease',
                                boxShadow: isSelected ? `0 0 10px rgba(245,215,110,0.2)` : 'none',
                            }}
                            onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = '#666'; }}
                            onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = '#333'; }}
                        >
                            {item.name}
                        </button>
                    );
                })}
            </div>

            {/* Description area */}
            {selected && (
                <div style={{ flex: 1, borderTop: `1px solid ${BORDER}`, paddingTop: '1rem' }}>
                    <div style={{ color: GOLD, fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                        {renderDescription(selected)}
                    </div>
                    <p style={{ color: '#888', fontSize: '0.8rem', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
                        {renderDetail(selected)}
                    </p>
                </div>
            )}
        </div>
    );
};

const StatRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
        <span style={{ color: '#888', fontSize: '0.85rem', letterSpacing: '0.05em' }}>{label}</span>
        <span style={{ color: '#eee', fontSize: '0.85rem', fontWeight: 'bold' }}>{value}</span>
    </div>
);

const LoadingScreen: React.FC = () => (
    <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: '"Vahika", "Cinzel", serif', color: GOLD, fontSize: '1.5rem',
        background: 'rgba(5,5,12,0.97)', letterSpacing: '0.2em',
    }}>
        Loading...
    </div>
);

const ErrorScreen: React.FC<{ message: string; onBack: () => void }> = ({ message, onBack }) => (
    <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: '"Vahika", "Cinzel", serif', color: '#e55',
        background: 'rgba(5,5,12,0.97)', gap: '1rem',
    }}>
        <div style={{ fontSize: '1.2rem' }}>⚠ {message}</div>
        <button onClick={onBack} style={{ color: GOLD, background: 'transparent', border: `1px solid ${GOLD}`, padding: '0.6rem 2rem', cursor: 'pointer', fontFamily: 'inherit' }}>
            Back to Menu
        </button>
    </div>
);
