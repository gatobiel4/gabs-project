import React, { useState } from 'react';
import { debugRegistry } from '../../debug/debugRegistry';
import {
    Section, Row, ActionBtn, EditRow, NoScene,
    useDebugPoll, D_GOOD, D_WARN, D_DANGER, D_LABEL, D_VALUE,
} from './debugUtils';

export const MovementSystemTab: React.FC = () => {
    useDebugPoll(100); // Faster poll — position changes every frame

    const [editSpeed, setEditSpeed] = useState('');
    const [teleX,     setTeleX]     = useState('');
    const [teleZ,     setTeleZ]     = useState('');
    const [teleMsg,   setTeleMsg]   = useState('');

    if (!debugRegistry.scene || !debugRegistry.movementSystem) return <NoScene />;

    const player      = debugRegistry.player;
    const ms          = debugRegistry.movementSystem;
    const ct          = debugRegistry.clickTarget;
    const pos         = player?.mesh?.position;
    const speed       = player?.stats.speed ?? 0;
    const entityCount = ms.getEntities().size;

    const applySpeed = () => {
        if (!player) return;
        const v = parseFloat(editSpeed);
        if (!isNaN(v) && v > 0) {
            player.stats.speed = Math.min(50, Math.max(0.5, v));
        }
        setEditSpeed('');
    };

    const teleport = () => {
        if (!player?.mesh) { setTeleMsg('No player mesh'); return; }
        const x = parseFloat(teleX);
        const z = parseFloat(teleZ);
        if (isNaN(x) || isNaN(z)) { setTeleMsg('Invalid coordinates'); return; }
        player.mesh.position.x = x;
        player.mesh.position.z = z;
        // Clear click target so the player doesn't immediately walk away
        if (ct) ct.hasTarget = false;
        setTeleMsg(`Teleported to (${x.toFixed(1)}, ${z.toFixed(1)})`);
        setTeleX('');
        setTeleZ('');
    };

    const clearTarget = () => {
        if (ct) ct.hasTarget = false;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>

            {/* Player Position */}
            <Section title="Player Position">
                {pos ? (
                    <>
                        <Row label="X" value={pos.x.toFixed(4)} />
                        <Row label="Y" value={pos.y.toFixed(4)} />
                        <Row label="Z" value={pos.z.toFixed(4)} />
                    </>
                ) : (
                    <div style={{ color: '#64748b', fontSize: '11px' }}>No player mesh</div>
                )}
            </Section>

            {/* Movement Speed */}
            <Section title="Movement Speed">
                <Row label="Speed" value={`${speed.toFixed(2)} u/s`} valueColor={D_VALUE} />
                <div style={{ marginTop: '4px' }}>
                    <EditRow
                        label="Speed"
                        value={editSpeed}
                        placeholder={String(speed)}
                        onChange={setEditSpeed}
                        onApply={applySpeed}
                    />
                </div>
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                    <ActionBtn onClick={() => { if (player) { player.stats.speed = 2;  } }} color={D_WARN}>Slow (2)</ActionBtn>
                    <ActionBtn onClick={() => { if (player) { player.stats.speed = 5;  } }} color={D_GOOD}>Normal (5)</ActionBtn>
                    <ActionBtn onClick={() => { if (player) { player.stats.speed = 15; } }} color="#f87171">Fast (15)</ActionBtn>
                    <ActionBtn onClick={() => { if (player) { player.stats.speed = 30; } }} color="#ef4444">Ultra (30)</ActionBtn>
                </div>
            </Section>

            {/* Click Target */}
            <Section title="Click Target">
                {ct ? (
                    <>
                        <Row label="Active" value={ct.hasTarget ? 'YES' : 'no'} valueColor={ct.hasTarget ? D_GOOD : '#64748b'} />
                        <Row label="X"      value={ct.x.toFixed(3)} />
                        <Row label="Z"      value={ct.z.toFixed(3)} />
                        <div style={{ marginTop: '4px' }}>
                            <ActionBtn onClick={clearTarget} color={D_DANGER} disabled={!ct.hasTarget}>
                                Stop Movement
                            </ActionBtn>
                        </div>
                    </>
                ) : (
                    <div style={{ color: '#475569', fontSize: '11px' }}>No click target data</div>
                )}
            </Section>

            {/* Teleport */}
            <Section title="Teleport Player">
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                    <span style={{ color: D_LABEL, fontSize: '11px', lineHeight: '22px', minWidth: '20px' }}>X</span>
                    <input type="number" value={teleX} onChange={e => setTeleX(e.target.value)} placeholder="x" style={inputStyle} />
                    <span style={{ color: D_LABEL, fontSize: '11px', lineHeight: '22px', minWidth: '20px' }}>Z</span>
                    <input type="number" value={teleZ} onChange={e => setTeleZ(e.target.value)} placeholder="z" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <ActionBtn onClick={teleport} color="#6366f1">Teleport</ActionBtn>
                    <ActionBtn onClick={() => { setTeleX('0'); setTeleZ('0'); }} color="#64748b">Origin (0,0)</ActionBtn>
                    <ActionBtn onClick={() => {
                        const x = (Math.random() * 20 - 10).toFixed(1);
                        const z = (Math.random() * 20 - 10).toFixed(1);
                        setTeleX(x); setTeleZ(z);
                    }} color="#64748b">Random</ActionBtn>
                </div>
                {teleMsg && <div style={{ marginTop: '4px', color: D_GOOD, fontSize: '10px' }}>{teleMsg}</div>}
            </Section>

            {/* Movement System Stats */}
            <Section title="MovementSystem">
                <Row label="Registered Entities" value={String(entityCount)} />
            </Section>

        </div>
    );
};

const inputStyle: React.CSSProperties = {
    flex: 1,
    background: '#0f172a',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: '3px',
    color: D_VALUE,
    padding: '2px 5px',
    fontSize: '11px',
    fontFamily: 'monospace',
    outline: 'none',
};
