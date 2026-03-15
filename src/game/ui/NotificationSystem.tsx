import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../state/gameStore';
import type { NotificationEntry, NotificationType } from '../../state/gameStore';

// ─── Colour Tokens (matching existing UI) ────────────────────────────────────
const GOLD   = '#f5d76e';
const PANEL  = 'rgba(10, 10, 18, 0.92)';
const FONT   = '"Vahika", "Cinzel", "Georgia", serif';

// Per-type accent colours
const TYPE_STYLES: Record<NotificationType, { border: string; icon: string; iconColor: string; glow: string }> = {
    success: { border: 'rgba(39, 174, 96, 0.45)',  icon: '✔',  iconColor: '#2ecc71', glow: 'rgba(46,204,113,0.15)' },
    warning: { border: 'rgba(243, 156, 18, 0.5)',  icon: '⚠',  iconColor: '#f39c12', glow: 'rgba(243,156,18,0.15)' },
    error:   { border: 'rgba(192, 57, 43, 0.55)',  icon: '✖',  iconColor: '#e74c3c', glow: 'rgba(231,76,60,0.15)'  },
    info:    { border: 'rgba(245, 215, 110, 0.3)',  icon: 'ℹ',  iconColor: GOLD,      glow: 'rgba(245,215,110,0.1)' },
};

// ─── Single Notification Toast ────────────────────────────────────────────────
interface ToastProps {
    entry: NotificationEntry;
    onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ entry, onRemove }) => {
    const { border, icon, iconColor, glow } = TYPE_STYLES[entry.type];

    // Fade-out state driven by CSS animation end
    const [visible, setVisible] = React.useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Fade in on mount
    useEffect(() => {
        // Tiny delay so the fade-in transition fires after mount
        const t = setTimeout(() => setVisible(true), 16);
        return () => clearTimeout(t);
    }, []);

    // Auto-dismiss: start fade-out before duration ends
    useEffect(() => {
        const fadeDelay = Math.max(entry.duration - 400, 200);
        timerRef.current = setTimeout(() => setVisible(false), fadeDelay);

        const removeDelay = setTimeout(() => onRemove(entry.id), entry.duration);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            clearTimeout(removeDelay);
        };
    }, [entry.id, entry.duration, onRemove]);

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                background: PANEL,
                border: `1px solid ${border}`,
                boxShadow: `0 0 16px rgba(0,0,0,0.7), inset 0 0 12px ${glow}`,
                padding: '0.55rem 0.75rem',
                minWidth: '220px',
                maxWidth: '320px',
                fontFamily: FONT,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.35s ease, transform 0.35s ease',
                pointerEvents: 'auto',
                cursor: 'pointer',
            }}
            onClick={() => onRemove(entry.id)}
            title="Click to dismiss"
        >
            {/* Icon */}
            <span style={{ color: iconColor, fontSize: '0.85rem', flexShrink: 0, marginTop: '1px' }}>
                {icon}
            </span>

            {/* Message */}
            <span style={{
                color: '#eaeaea',
                fontSize: '0.78rem',
                letterSpacing: '0.04em',
                lineHeight: '1.4',
                flex: 1,
            }}>
                {entry.message}
            </span>
        </div>
    );
};

// ─── Notification System Container ────────────────────────────────────────────
export const NotificationSystem: React.FC = () => {
    const notifications = useGameStore((s) => s.notifications);
    const removeNotification = useGameStore((s) => s.removeNotification);

    if (notifications.length === 0) return null;

    return (
        <div style={{
            position: 'absolute',
            bottom: '1.5rem',
            right: '1.5rem',
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: '0.5rem',
            zIndex: 30,
            pointerEvents: 'none',  // container is passthrough; toasts re-enable on hover
        }}>
            {notifications.map((entry) => (
                <Toast key={entry.id} entry={entry} onRemove={removeNotification} />
            ))}
        </div>
    );
};
