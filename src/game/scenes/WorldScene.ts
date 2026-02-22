import {
    Engine,
    Scene,
    ArcRotateCamera,
    Vector3,
    HemisphericLight,
    DirectionalLight,
    MeshBuilder,
    StandardMaterial,
    Color3,
    Color4,
    Animation,
} from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials';
import { Player } from '../entities/Player';
import { MovementSystem } from '../systems/MovementSystem';

export const createWorldScene = (engine: Engine): Scene => {
    const scene = new Scene(engine);

    // Atmospheric dark background
    scene.clearColor = new Color4(0.07, 0.07, 0.1, 1);

    // ─────────────────────────────────────────────────────────────
    // 1. ISOMETRIC CAMERA (ArcRotateCamera with fixed angle)
    // ─────────────────────────────────────────────────────────────
    // Alpha  = horizontal rotation (locked)
    // Beta   = vertical angle  — Math.PI / 4 gives the classic ~45° isometric tilt
    // Radius = distance from target (zoom)
    const camera = new ArcRotateCamera(
        'iso-camera',
        -Math.PI / 4,   // alpha: 45° facing direction (fixed)
        Math.PI / 4,    // beta:  classic isometric angle
        30,             // radius: initial zoom distance
        Vector3.Zero(), // target: center of world (player will be here later)
        scene
    );

    // 2. LOCK ROTATION and CLAMP ZOOM min/max
    camera.lowerRadiusLimit = 10;   // max zoom in
    camera.upperRadiusLimit = 60;   // max zoom out
    camera.lowerBetaLimit = Math.PI / 4; // lock vertical angle
    camera.upperBetaLimit = Math.PI / 4; // lock vertical angle
    camera.lowerAlphaLimit = -Math.PI / 4; // lock horizontal angle
    camera.upperAlphaLimit = -Math.PI / 4; // lock horizontal angle

    // Allow mouse wheel zoom only (no orbit drag)
    camera.attachControl(engine.getRenderingCanvas(), true);
    camera.inputs.removeByType('ArcRotateCameraPointerInput');  // remove mouse drag rotation

    // ─────────────────────────────────────────────────────────────
    // PLAYER ENTITY
    // ─────────────────────────────────────────────────────────────
    const player = new Player();
    player.spawn(scene, Vector3.Zero());

    // ─────────────────────────────────────────────────────────────
    // MOVEMENT SYSTEM — central entity update registry
    // ─────────────────────────────────────────────────────────────
    const movementSystem = new MovementSystem();
    movementSystem.register(player);

    // ─────────────────────────────────────────────────────────────
    // GAME LOOP
    // ─────────────────────────────────────────────────────────────
    const CAMERA_LERP = 0.05;

    scene.registerBeforeRender(() => {
        const dt = engine.getDeltaTime() / 1000;

        // Tick all registered entities via MovementSystem
        movementSystem.update(dt, scene);

        // Smooth camera follow toward player position
        camera.target.x += (player.position.x - camera.target.x) * CAMERA_LERP;
        camera.target.y += (player.position.y - camera.target.y) * CAMERA_LERP;
        camera.target.z += (player.position.z - camera.target.z) * CAMERA_LERP;
    });

    // Clean up all entities when the scene is disposed
    scene.onDisposeObservable.add(() => movementSystem.disposeAll());

    // ─────────────────────────────────────────────────────────────
    // 4. GROUND PLANE
    // ─────────────────────────────────────────────────────────────
    const ground = MeshBuilder.CreateGround('world-ground', { width: 50, height: 50, subdivisions: 2 }, scene);
    const groundMat = new StandardMaterial('ground-mat', scene);
    groundMat.diffuseColor = new Color3(0.12, 0.15, 0.12);
    groundMat.specularColor = new Color3(0, 0, 0); // No shine
    ground.material = groundMat;

    // ─────────────────────────────────────────────────────────────
    // 5. DEBUG GRID OVERLAY (for scale testing)
    // ─────────────────────────────────────────────────────────────
    const gridOverlay = MeshBuilder.CreateGround('debug-grid', { width: 50, height: 50, subdivisions: 2 }, scene);
    gridOverlay.position.y = 0.01; // Sit just above the ground so it doesn't z-fight
    gridOverlay.isPickable = false; // Let raycasts pass through to the ground below

    const gridMat = new GridMaterial('grid-mat', scene);
    gridMat.majorUnitFrequency = 5;             // Bold line every 5 units
    gridMat.minorUnitVisibility = 0.3;
    gridMat.gridRatio = 1;             // 1 unit per cell
    gridMat.mainColor = new Color3(0.15, 0.18, 0.15);
    gridMat.lineColor = new Color3(0.25, 0.35, 0.25);
    gridMat.opacity = 0.6;
    gridOverlay.material = gridMat;

    // ─────────────────────────────────────────────────────────────
    // 6. BASIC LIGHTING (simple and cheap)
    // ─────────────────────────────────────────────────────────────
    // Ambient sky/ground fill
    const hemiLight = new HemisphericLight('hemi-light', new Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.5;
    hemiLight.diffuse = new Color3(0.8, 0.85, 1.0);   // Cool sky blue
    hemiLight.groundColor = new Color3(0.2, 0.15, 0.1);   // Warm earth bounce

    // Single directional "sun" light casting shadows (cheap, one light)
    const sunLight = new DirectionalLight('sun-light', new Vector3(-1, -2, -1), scene);
    sunLight.intensity = 1.0;
    sunLight.diffuse = new Color3(1.0, 0.95, 0.8);  // Warm sunlight

    // ─────────────────────────────────────────────────────────────
    // STEP 4.1 — MOUSE PICKING: detect click point on ground
    // STEP 4.2 — CONVERT PICK TO TARGET POINT (with visual marker)
    // ─────────────────────────────────────────────────────────────
    const clickTarget = { x: 0, y: 0, z: 0, hasTarget: false };

    // Visual click marker — a flat glowing disc on the ground
    const clickMarker = MeshBuilder.CreateDisc('click-marker', { radius: 0.4, tessellation: 32 }, scene);
    clickMarker.rotation.x = Math.PI / 2;  // Lay flat on the ground
    clickMarker.position.y = 0.02;          // Slightly above ground to avoid z-fighting
    clickMarker.isPickable = false;         // Don't interfere with ground picking
    clickMarker.setEnabled(false);          // Hidden until first click

    const markerMat = new StandardMaterial('click-marker-mat', scene);
    markerMat.diffuseColor = new Color3(0.3, 1.0, 0.5);  // Bright green
    markerMat.emissiveColor = new Color3(0.1, 0.6, 0.3);  // Self-lit glow
    markerMat.disableLighting = true;
    clickMarker.material = markerMat;

    // Fade-out animation for the marker
    const fadeAnim = new Animation(
        'markerFade', 'visibility', 30,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    fadeAnim.setKeys([
        { frame: 0, value: 1 },
        { frame: 20, value: 0 },
    ]);
    clickMarker.animations = [fadeAnim];

    scene.onPointerDown = (_evt) => {
        if (_evt.button !== 0) return;

        const pick = scene.pick(scene.pointerX, scene.pointerY);

        if (pick.hit && pick.pickedPoint && pick.pickedMesh?.name === 'world-ground') {
            // Convert pick result into a clean target point
            const target = new Vector3(
                pick.pickedPoint.x,
                0,
                pick.pickedPoint.z
            );

            clickTarget.x = target.x;
            clickTarget.y = target.y;
            clickTarget.z = target.z;
            clickTarget.hasTarget = true;

            // Move marker to clicked point, show and fade it out
            clickMarker.position.x = target.x;
            clickMarker.position.z = target.z;
            clickMarker.setEnabled(true);
            clickMarker.visibility = 1;
            scene.beginAnimation(clickMarker, 0, 20, false);

            console.log(`🖱️ Target point: x=${target.x.toFixed(2)}, z=${target.z.toFixed(2)}`);
        }
    };

    // Expose to player movement system
    (scene as any).clickTarget = clickTarget;

    return scene;
};
