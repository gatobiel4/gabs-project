import React, { useState } from 'react';
import { debugRegistry } from '../../debug/debugRegistry';
import {
    Section, Row, ActionBtn, EditRow, NoScene,
    useDebugPoll, D_GOOD, D_WARN, D_VALUE,
} from './debugUtils';

export const CameraWorldTab: React.FC = () => {
    useDebugPoll(200);

    const [gridVisible, setGridVisible] = useState<boolean | null>(null);
    const [editRadius,  setEditRadius]  = useState('');
    const [editAlpha,   setEditAlpha]   = useState('');
    const [editBeta,    setEditBeta]    = useState('');

    if (!debugRegistry.scene) return <NoScene />;

    const cam  = debugRegistry.camera;
    const grid = debugRegistry.debugGrid;

    // Determine current grid state
    const isGridOn = gridVisible ?? (grid ? grid.isEnabled() : false);

    const toggleGrid = () => {
        if (!grid) return;
        const next = !grid.isEnabled();
        grid.setEnabled(next);
        setGridVisible(next);
    };

    const applyRadius = () => {
        if (!cam) return;
        const v = parseFloat(editRadius);
        if (!isNaN(v)) {
            cam.radius = Math.min(cam.upperRadiusLimit ?? 60, Math.max(cam.lowerRadiusLimit ?? 5, v));
        }
        setEditRadius('');
    };

    const applyAlpha = () => {
        if (!cam) return;
        const v = parseFloat(editAlpha) * (Math.PI / 180); // degrees -> radians
        if (!isNaN(v)) cam.alpha = v;
        setEditAlpha('');
    };

    const applyBeta = () => {
        if (!cam) return;
        const v = parseFloat(editBeta) * (Math.PI / 180);
        if (!isNaN(v)) cam.beta = v;
        setEditBeta('');
    };

    const resetCamera = () => {
        if (!cam) return;
        cam.alpha   = -Math.PI / 4;
        cam.beta    = Math.PI  / 4;
        cam.radius  = 30;
        cam.target.set(0, 0, 0);
    };

    const toDeg = (rad: number) => ((rad * 180) / Math.PI).toFixed(1) + '°';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>

            {/* Camera Info */}
            <Section title="Camera (ArcRotate)">
                {cam ? (
                    <>
                        <Row label="Alpha"  value={toDeg(cam.alpha)} />
                        <Row label="Beta"   value={toDeg(cam.beta)} />
                        <Row label="Radius" value={cam.radius.toFixed(2)} />
                        <Row label="Target" value={`(${cam.target.x.toFixed(1)}, ${cam.target.y.toFixed(1)}, ${cam.target.z.toFixed(1)})`} />
                        <Row label="Zoom min/max" value={`${cam.lowerRadiusLimit ?? '--'} / ${cam.upperRadiusLimit ?? '--'}`} />
                    </>
                ) : (
                    <div style={{ color: '#64748b', fontSize: '11px' }}>Camera not available</div>
                )}
            </Section>

            {/* Camera Controls */}
            {cam && (
                <Section title="Camera Controls">
                    <EditRow
                        label="Radius"
                        value={editRadius}
                        placeholder={cam.radius.toFixed(1)}
                        onChange={setEditRadius}
                        onApply={applyRadius}
                    />
                    <EditRow
                        label="Alpha°"
                        value={editAlpha}
                        placeholder={toDeg(cam.alpha)}
                        onChange={setEditAlpha}
                        onApply={applyAlpha}
                    />
                    <EditRow
                        label="Beta°"
                        value={editBeta}
                        placeholder={toDeg(cam.beta)}
                        onChange={setEditBeta}
                        onApply={applyBeta}
                    />
                    <div style={{ marginTop: '4px' }}>
                        <ActionBtn onClick={resetCamera} color="#6366f1">Reset Camera</ActionBtn>
                    </div>
                </Section>
            )}

            {/* World Settings */}
            <Section title="World Settings">
                <Row label="Scene Name" value={debugRegistry.scene?.name ?? '--'} />
                <Row
                    label="Debug Grid"
                    value={isGridOn ? 'VISIBLE' : 'hidden'}
                    valueColor={isGridOn ? D_GOOD : D_WARN}
                />
                <div style={{ marginTop: '4px' }}>
                    <ActionBtn onClick={toggleGrid} color={isGridOn ? D_WARN : D_GOOD}>
                        {isGridOn ? 'Hide Grid' : 'Show Grid'}
                    </ActionBtn>
                </div>
            </Section>

            {/* Click Target */}
            <Section title="Click Target">
                {debugRegistry.clickTarget ? (
                    <>
                        <Row label="Has Target" value={debugRegistry.clickTarget.hasTarget ? 'YES' : 'no'} valueColor={debugRegistry.clickTarget.hasTarget ? D_GOOD : '#64748b'} />
                        <Row label="X" value={debugRegistry.clickTarget.x.toFixed(3)} valueColor={D_VALUE} />
                        <Row label="Z" value={debugRegistry.clickTarget.z.toFixed(3)} valueColor={D_VALUE} />
                    </>
                ) : (
                    <div style={{ color: '#475569', fontSize: '11px' }}>No click data yet</div>
                )}
            </Section>

        </div>
    );
};
