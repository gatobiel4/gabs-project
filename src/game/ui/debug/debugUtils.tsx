import React, { useState, useEffect } from 'react';

// ─── Shared colour constants ─────────────────────────────────────────────────
export const D_BG       = 'rgba(12, 12, 20, 0.0)';   // transparent — panels inherit window bg
export const D_SECTION  = 'rgba(30, 30, 50, 0.6)';
export const D_BORDER   = 'rgba(99, 102, 241, 0.25)';
export const D_LABEL    = '#94a3b8';
export const D_VALUE    = '#93c5fd';
export const D_GOOD     = '#4ade80';
export const D_WARN     = '#facc15';
export const D_DANGER   = '#f87171';
export const D_GOLD     = '#f5d76e';
export const D_TEXT     = '#e2e8f0';
export const D_MUTED    = '#475569';

// ─── useDebugPoll ────────────────────────────────────────────────────────────
/** Triggers a re-render every `ms` milliseconds — used for polling debug registry */
export const useDebugPoll = (ms = 200) => {
    const [, setTick] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setTick(t => t + 1), ms);
        return () => clearInterval(id);
    }, [ms]);
};

// ─── Section ─────────────────────────────────────────────────────────────────
export const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div style={{
        background: D_SECTION,
        border: `1px solid ${D_BORDER}`,
        borderRadius: '4px',
        padding: '6px 8px',
    }}>
        <div style={{ color: '#a5b4fc', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '5px', textTransform: 'uppercase' }}>
            {title}
        </div>
        {children}
    </div>
);

// ─── Row ─────────────────────────────────────────────────────────────────────
export const Row: React.FC<{ label: string; value: string; valueColor?: string }> = ({ label, value, valueColor }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 0', borderBottom: `1px solid rgba(99,102,241,0.08)` }}>
        <span style={{ color: D_LABEL, fontSize: '11px' }}>{label}</span>
        <span style={{ color: valueColor ?? D_VALUE, fontSize: '11px', fontFamily: 'monospace' }}>{value}</span>
    </div>
);

// ─── MiniBar ─────────────────────────────────────────────────────────────────
export const MiniBar: React.FC<{ current: number; max: number; color: string }> = ({ current, max, color }) => (
    <div style={{ height: '3px', background: '#1e293b', borderRadius: '2px', margin: '2px 0 4px 0', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(100, max > 0 ? (current / max) * 100 : 0)}%`, background: color, transition: 'width 0.15s' }} />
    </div>
);

// ─── ActionBtn ───────────────────────────────────────────────────────────────
export const ActionBtn: React.FC<{
    onClick: () => void;
    color?: string;
    children: React.ReactNode;
    disabled?: boolean;
}> = ({ onClick, color = '#6366f1', children, disabled = false }) => (
    <button
        onClick={disabled ? undefined : onClick}
        style={{
            background: disabled ? '#1e293b' : `rgba(${hexToRgb(color)}, 0.15)`,
            border: `1px solid ${disabled ? '#334155' : color}`,
            borderRadius: '3px',
            color: disabled ? D_MUTED : color,
            cursor: disabled ? 'not-allowed' : 'pointer',
            padding: '3px 8px',
            fontSize: '10px',
            fontFamily: 'monospace',
        }}
    >
        {children}
    </button>
);

// ─── EditRow ─────────────────────────────────────────────────────────────────
export const EditRow: React.FC<{
    label: string;
    value: string;
    placeholder?: string;
    onChange: (v: string) => void;
    onApply: () => void;
}> = ({ label, value, placeholder, onChange, onApply }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 0' }}>
        <span style={{ color: D_LABEL, fontSize: '11px', minWidth: '60px' }}>{label}</span>
        <input
            type="number"
            value={value}
            placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') onApply(); }}
            style={{
                flex: 1,
                background: '#0f172a',
                border: `1px solid rgba(99,102,241,0.3)`,
                borderRadius: '3px',
                color: D_VALUE,
                padding: '2px 5px',
                fontSize: '11px',
                fontFamily: 'monospace',
                outline: 'none',
            }}
        />
        <ActionBtn onClick={onApply} color="#6366f1">Set</ActionBtn>
    </div>
);

// ─── NoScene placeholder ─────────────────────────────────────────────────────
export const NoScene: React.FC = () => (
    <div style={{ color: D_DANGER, padding: '12px', textAlign: 'center', fontSize: '11px' }}>
        No WorldScene active — load World first.
    </div>
);

// ─── Helpers ─────────────────────────────────────────────────────────────────
function hexToRgb(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
}
