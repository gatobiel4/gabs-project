import type { ArcRotateCamera, Scene } from '@babylonjs/core';
import type { Player } from '../entities/Player';
import type { MovementSystem } from '../systems/MovementSystem';
import type { Entity } from '../entities/Entity';

/**
 * Debug registry — a mutable singleton that bridges live Babylon.js objects
 * with React debug UI tabs without going through Zustand.
 *
 * WorldScene populates every field on creation and clears them on dispose.
 * Debug tabs read from this object and poll it on a ~200ms interval.
 */
export interface DebugRegistryShape {
    /** The active Babylon.js scene (WorldScene only) */
    scene: Scene | null;
    /** The live Player entity */
    player: Player | null;
    /** The MovementSystem managing all entities */
    movementSystem: MovementSystem | null;
    /** The isometric camera */
    camera: ArcRotateCamera | null;
    /** The shared click-target object written by scene.onPointerDown */
    clickTarget: { x: number; y: number; z: number; hasTarget: boolean } | null;
    /** The debug grid overlay mesh — use .setEnabled() / .isEnabled() */
    debugGrid: any | null;
    /** Spawn a debug entity into the world */
    spawnEntity: ((type: 'npc' | 'monster', name: string, x: number, z: number) => Entity | null) | null;
    /** Remove a previously spawned debug entity by id */
    removeEntity: ((id: string) => void) | null;
}

export const debugRegistry: DebugRegistryShape = {
    scene: null,
    player: null,
    movementSystem: null,
    camera: null,
    clickTarget: null,
    debugGrid: null,
    spawnEntity: null,
    removeEntity: null,
};
