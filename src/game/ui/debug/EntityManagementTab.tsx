import React, { useState } from 'react';
import { debugRegistry } from '../../debug/debugRegistry';
import type { Entity } from '../../entities/Entity';
import type { Monster } from '../../entities/Monster';
import {
    Section, Row, ActionBtn, NoScene,
    useDebugPoll, D_GOOD, D_WARN, D_DANGER, D_GOLD, D_LABEL, D_VALUE,
} from './debugUtils';

const entityTypeColor: Record<string, string> = {
    player:  '#a5b4fc',
    npc:     D_GOLD,
    monster: D_DANGER,
    item:    D_GOOD,
    trigger: D_WARN,
};

export const EntityManagementTab: React.FC = () => {
    useDebugPoll(300);

    const [spawnType, setSpawnType]   = useState<'npc' | 'monster'>('npc');
    const [spawnName, setSpawnName]   = useState('');
    const [spawnX,    setSpawnX]      = useState('');
    const [spawnZ,    setSpawnZ]      = useState('');
    const [spawnMsg,  setSpawnMsg]    = useState('');

    if (!debugRegistry.scene || !debugRegistry.movementSystem) return <NoScene />;

    const entityMap = debugRegistry.movementSystem.getEntities();
    const entities  = Array.from(entityMap.values());

    const handleSpawn = () => {
        const name = spawnName.trim() || (spawnType === 'npc' ? 'Debug NPC' : 'Goblin');
        const px   = debugRegistry.player?.mesh?.position.x ?? 0;
        const pz   = debugRegistry.player?.mesh?.position.z ?? 0;
        const x    = parseFloat(spawnX)  || (px + 3 + Math.random() * 2 - 1);
        const z    = parseFloat(spawnZ)  || (pz + 3 + Math.random() * 2 - 1);

        const entity = debugRegistry.spawnEntity?.(spawnType, name, x, z);
        if (entity) {
            setSpawnMsg(`Spawned ${spawnType} "${name}" at (${x.toFixed(1)}, ${z.toFixed(1)})`);
            setSpawnName('');
            setSpawnX('');
            setSpawnZ('');
        } else {
            setSpawnMsg('Spawn failed — check console.');
        }
    };

    const handleRemove = (id: string) => {
        debugRegistry.removeEntity?.(id);
        setSpawnMsg(`Removed entity ${id.slice(0, 20)}...`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>

            {/* Summary */}
            <Section title="Summary">
                <Row label="Total Entities"   value={String(entities.length)} />
                <Row label="Players"   value={String(entities.filter(e => e.type === 'player').length)} />
                <Row label="NPCs"      value={String(entities.filter(e => e.type === 'npc').length)} valueColor={D_GOLD} />
                <Row label="Monsters"  value={String(entities.filter(e => e.type === 'monster').length)} valueColor={D_DANGER} />
            </Section>

            {/* Entity List */}
            <Section title="Entity List">
                {entities.length === 0 ? (
                    <div style={{ color: '#475569', fontSize: '11px' }}>No entities</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxHeight: '200px', overflowY: 'auto' }}>
                        {entities.map(entity => (
                            <EntityRow key={entity.id} entity={entity} onRemove={handleRemove} />
                        ))}
                    </div>
                )}
            </Section>

            {/* Spawn Entity */}
            <Section title="Spawn Entity">
                {/* Type toggle */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '5px' }}>
                    {(['npc', 'monster'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setSpawnType(t)}
                            style={{
                                background: spawnType === t ? 'rgba(99,102,241,0.2)' : 'transparent',
                                border: `1px solid ${spawnType === t ? '#6366f1' : '#334155'}`,
                                borderRadius: '3px',
                                color: spawnType === t ? '#a5b4fc' : '#64748b',
                                padding: '2px 10px',
                                fontSize: '10px',
                                cursor: 'pointer',
                                fontFamily: 'monospace',
                            }}
                        >
                            {t.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                    <span style={{ color: D_LABEL, fontSize: '11px', minWidth: '40px' }}>Name</span>
                    <input
                        type="text"
                        value={spawnName}
                        onChange={e => setSpawnName(e.target.value)}
                        placeholder={spawnType === 'npc' ? 'Villager' : 'Goblin'}
                        style={inputStyle}
                    />
                </div>

                {/* Position */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '5px' }}>
                    <span style={{ color: D_LABEL, fontSize: '11px', lineHeight: '22px', minWidth: '40px' }}>Pos</span>
                    <input type="number" value={spawnX} onChange={e => setSpawnX(e.target.value)} placeholder="X (auto)" style={{ ...inputStyle, flex: 1 }} />
                    <input type="number" value={spawnZ} onChange={e => setSpawnZ(e.target.value)} placeholder="Z (auto)" style={{ ...inputStyle, flex: 1 }} />
                </div>

                <ActionBtn onClick={handleSpawn} color={spawnType === 'npc' ? D_GOLD : D_DANGER}>
                    Spawn {spawnType.toUpperCase()}
                </ActionBtn>

                {spawnMsg && (
                    <div style={{ marginTop: '4px', color: D_GOOD, fontSize: '10px' }}>{spawnMsg}</div>
                )}
            </Section>

        </div>
    );
};

// ─── EntityRow sub-component ──────────────────────────────────────────────────
const EntityRow: React.FC<{ entity: Entity; onRemove: (id: string) => void }> = ({ entity, onRemove }) => {
    const pos = entity.mesh?.position;
    const posStr = pos ? `(${pos.x.toFixed(1)}, ${pos.z.toFixed(1)})` : 'no mesh';
    const isPlayer = entity.type === 'player';
    const color = entityTypeColor[entity.type] ?? '#e2e8f0';

    // Try to read monster state
    const monsterState = entity.type === 'monster'
        ? (entity as unknown as Monster).state
        : null;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(15,23,42,0.6)',
            border: `1px solid ${color}30`,
            borderRadius: '3px',
            padding: '3px 5px',
        }}>
            <span style={{ color, fontSize: '10px', minWidth: '50px' }}>{entity.type}</span>
            <span style={{ color: D_VALUE, fontSize: '10px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {entity.id.slice(0, 18)}...
            </span>
            <span style={{ color: '#64748b', fontSize: '10px', minWidth: '80px' }}>{posStr}</span>
            {monsterState && (
                <span style={{ color: D_WARN, fontSize: '9px', minWidth: '40px' }}>[{monsterState}]</span>
            )}
            {!isPlayer && (
                <button
                    onClick={() => onRemove(entity.id)}
                    style={{ background: 'transparent', border: `1px solid ${D_DANGER}50`, borderRadius: '3px', color: D_DANGER, cursor: 'pointer', fontSize: '10px', padding: '0 4px' }}
                >
                    rm
                </button>
            )}
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
