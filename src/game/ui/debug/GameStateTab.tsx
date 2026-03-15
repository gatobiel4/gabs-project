import React, { useState } from 'react';
import { useGameStore, type NotificationType } from '../../../state/gameStore';
import {
    Section, Row, ActionBtn, useDebugPoll, D_GOOD, D_WARN, D_DANGER, D_GOLD,
} from './debugUtils';

const NOTIFICATION_TYPES: NotificationType[] = ['info', 'success', 'warning', 'error'];
const typeColor: Record<NotificationType, string> = {
    info: '#60a5fa', success: D_GOOD, warning: D_WARN, error: D_DANGER,
};

export const GameStateTab: React.FC = () => {
    useDebugPoll(300);

    const {
        currentScene, isPaused, setPaused,
        playerName, selectedRaceId, selectedClassId,
        notifications, addNotification, removeNotification,
    } = useGameStore();

    const [notifMsg,  setNotifMsg]  = useState('Test notification');
    const [notifType, setNotifType] = useState<NotificationType>('info');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>

            {/* Game State */}
            <Section title="Game State">
                <Row label="Scene"    value={currentScene} />
                <Row label="Paused"   value={isPaused ? 'YES' : 'no'} valueColor={isPaused ? D_WARN : D_GOOD} />
                <div style={{ marginTop: '5px' }}>
                    <ActionBtn onClick={() => setPaused(!isPaused)} color={isPaused ? D_GOOD : D_WARN}>
                        {isPaused ? 'Resume Game' : 'Pause Game'}
                    </ActionBtn>
                </div>
            </Section>

            {/* Character Data */}
            <Section title="Character Data">
                <Row label="Name"     value={playerName || '—'} />
                <Row label="Race ID"  value={selectedRaceId  ?? '—'} />
                <Row label="Class ID" value={selectedClassId ?? '—'} />
            </Section>

            {/* Notification Tester */}
            <Section title="Send Notification">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <input
                        type="text"
                        value={notifMsg}
                        onChange={e => setNotifMsg(e.target.value)}
                        placeholder="Message text..."
                        style={{
                            background: '#0f172a',
                            border: '1px solid rgba(99,102,241,0.3)',
                            borderRadius: '3px',
                            color: '#e2e8f0',
                            padding: '3px 6px',
                            fontSize: '11px',
                            fontFamily: 'monospace',
                            outline: 'none',
                        }}
                    />
                    {/* Type selector */}
                    <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                        {NOTIFICATION_TYPES.map(t => (
                            <button
                                key={t}
                                onClick={() => setNotifType(t)}
                                style={{
                                    background: notifType === t ? `rgba(99,102,241,0.2)` : 'transparent',
                                    border: `1px solid ${notifType === t ? typeColor[t] : '#334155'}`,
                                    borderRadius: '3px',
                                    color: typeColor[t],
                                    padding: '2px 6px',
                                    fontSize: '10px',
                                    cursor: 'pointer',
                                    fontFamily: 'monospace',
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <ActionBtn
                        onClick={() => addNotification(notifMsg || 'Debug message', notifType)}
                        color={typeColor[notifType]}
                    >
                        Send Notification
                    </ActionBtn>
                </div>
            </Section>

            {/* Active Notifications */}
            <Section title={`Active Notifications (${notifications.length})`}>
                {notifications.length === 0 ? (
                    <div style={{ color: '#475569', fontSize: '11px' }}>No active notifications</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {notifications.map(n => (
                            <div
                                key={n.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'rgba(15,23,42,0.8)',
                                    border: `1px solid ${typeColor[n.type]}40`,
                                    borderRadius: '3px',
                                    padding: '2px 6px',
                                    fontSize: '10px',
                                }}
                            >
                                <span style={{ color: typeColor[n.type], marginRight: '4px' }}>[{n.type}]</span>
                                <span style={{ color: '#e2e8f0', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.message}</span>
                                <button
                                    onClick={() => removeNotification(n.id)}
                                    style={{ background: 'transparent', border: 'none', color: D_DANGER, cursor: 'pointer', fontSize: '11px', marginLeft: '4px' }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <ActionBtn onClick={() => notifications.forEach(n => removeNotification(n.id))} color={D_DANGER}>
                            Clear All
                        </ActionBtn>
                    </div>
                )}
            </Section>

        </div>
    );
};
