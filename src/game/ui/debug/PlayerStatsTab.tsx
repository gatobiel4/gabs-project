import React, { useState } from 'react';
import { useGameStore } from '../../../state/gameStore';
import { debugRegistry } from '../../debug/debugRegistry';
import {
    Section, Row, MiniBar, ActionBtn, EditRow, NoScene,
    useDebugPoll, D_GOOD, D_DANGER, D_GOLD,
} from './debugUtils';

export const PlayerStatsTab: React.FC = () => {
    useDebugPoll(200);

    const { playerName, setPlayerStats } = useGameStore();

    const [editHp,    setEditHp]    = useState('');
    const [editMp,    setEditMp]    = useState('');
    const [editSpeed, setEditSpeed] = useState('');
    const [editStr,   setEditStr]   = useState('');
    const [editDex,   setEditDex]   = useState('');
    const [editInt,   setEditInt]   = useState('');

    const player = debugRegistry.player;
    if (!player) return <NoScene />;

    const s = player.stats;

    /** Push player.stats back into the Zustand store so the HUD updates */
    const sync = () => setPlayerStats({ ...player.stats });

    const quick = (fn: () => void) => { fn(); sync(); };

    const apply = (field: keyof typeof s, raw: string, min = 0, max?: number) => {
        const n = parseFloat(raw);
        if (isNaN(n)) return;
        let clamped = Math.max(min, n);
        if (max !== undefined) clamped = Math.min(max, clamped);
        (s as Record<string, number>)[field] = clamped;
        sync();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>

            {/* Identity */}
            <Section title="Identity">
                <Row label="Player Name" value={playerName} />
                <Row label="Level"       value={String(s.level)} valueColor={D_GOLD} />
            </Section>

            {/* Vitals */}
            <Section title="Vitals">
                <Row label="HP" value={`${s.hp} / ${s.maxHp}`} valueColor={D_DANGER} />
                <MiniBar current={s.hp} max={s.maxHp} color="#dc2626" />
                <Row label="MP" value={`${s.mp} / ${s.maxMp}`} valueColor="#60a5fa" />
                <MiniBar current={s.mp} max={s.maxMp} color="#1e40af" />
                <Row label="XP" value={`${s.xp} / ${s.maxXp}`} valueColor={D_GOLD} />
                <MiniBar current={s.xp} max={s.maxXp} color="#f5d76e" />
            </Section>

            {/* Attributes */}
            <Section title="Attributes">
                <Row label="Strength"      value={String(s.strength)} />
                <Row label="Dexterity"     value={String(s.dexterity)} />
                <Row label="Intelligence"  value={String(s.intelligence)} />
                <Row label="Speed"         value={`${s.speed} u/s`} />
            </Section>

            {/* Quick Actions */}
            <Section title="Quick Actions">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    <ActionBtn onClick={() => quick(() => player.heal(s.maxHp))} color={D_GOOD}>Heal Full</ActionBtn>
                    <ActionBtn onClick={() => quick(() => { s.mp = s.maxMp; })} color="#60a5fa">Restore MP</ActionBtn>
                    <ActionBtn onClick={() => quick(() => player.takeDamage(10))} color={D_DANGER}>-10 HP</ActionBtn>
                    <ActionBtn onClick={() => quick(() => player.takeDamage(25))} color={D_DANGER}>-25 HP</ActionBtn>
                    <ActionBtn onClick={() => quick(() => player.gainXp(25))} color={D_GOLD}>+25 XP</ActionBtn>
                    <ActionBtn onClick={() => quick(() => player.gainXp(100))} color={D_GOLD}>+100 XP</ActionBtn>
                    <ActionBtn onClick={() => quick(() => player.gainXp(s.maxXp))} color={D_GOLD}>Force Level-Up</ActionBtn>
                </div>
            </Section>

            {/* Edit Stats */}
            <Section title="Edit Stats (Enter or Set to apply)">
                <EditRow label="HP"    value={editHp}    placeholder={String(s.hp)}           onChange={setEditHp}    onApply={() => { apply('hp', editHp, 0, s.maxHp); setEditHp(''); }} />
                <EditRow label="MaxHP" value={''}        placeholder={String(s.maxHp)}         onChange={() => {}} onApply={() => {}} />
                <EditRow label="MP"    value={editMp}    placeholder={String(s.mp)}            onChange={setEditMp}    onApply={() => { apply('mp', editMp, 0, s.maxMp); setEditMp(''); }} />
                <EditRow label="Speed" value={editSpeed} placeholder={String(s.speed)}         onChange={setEditSpeed} onApply={() => { apply('speed', editSpeed, 0.5, 30); setEditSpeed(''); }} />
                <EditRow label="STR"   value={editStr}   placeholder={String(s.strength)}     onChange={setEditStr}   onApply={() => { apply('strength', editStr, 1, 999); setEditStr(''); }} />
                <EditRow label="DEX"   value={editDex}   placeholder={String(s.dexterity)}    onChange={setEditDex}   onApply={() => { apply('dexterity', editDex, 1, 999); setEditDex(''); }} />
                <EditRow label="INT"   value={editInt}   placeholder={String(s.intelligence)} onChange={setEditInt}   onApply={() => { apply('intelligence', editInt, 1, 999); setEditInt(''); }} />
            </Section>

        </div>
    );
};
