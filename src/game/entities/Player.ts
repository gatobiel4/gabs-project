import { Scene, MeshBuilder, StandardMaterial, Color3, Vector3 } from '@babylonjs/core';
import { Entity } from './Entity';

/** Stats that define the player's current state */
export interface PlayerStats {
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    speed: number;    // Movement units per second
    level: number;
    // These will be expanded by race/class modifiers in Step 8
    strength: number;
    dexterity: number;
    intelligence: number;
}

const DEFAULT_STATS: PlayerStats = {
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    speed: 5,
    level: 1,
    strength: 10,
    dexterity: 10,
    intelligence: 10,
};

const STOP_THRESHOLD = 0.15;     // Units — how close is "close enough" to stop
const ROTATION_SPEED = 10;       // Radians per second for turning

export class Player extends Entity {
    public stats: PlayerStats;

    // Internal movement state
    private _target: { x: number; y: number; z: number; hasTarget: boolean } | null = null;

    constructor(stats: Partial<PlayerStats> = {}) {
        super('player', ['collidable']);
        this.stats = { ...DEFAULT_STATS, ...stats };
    }

    /** Spawn the player mesh into the scene at the given position */
    public spawn(scene: Scene, position: Vector3 = Vector3.Zero()): void {
        const HEIGHT = 1.8;

        // Placeholder capsule — will be replaced with a 3D model later
        const mesh = MeshBuilder.CreateCapsule(
            'player',
            { radius: 0.4, height: HEIGHT, tessellation: 12 },
            scene
        );
        mesh.position = new Vector3(position.x, HEIGHT / 2, position.z);
        mesh.isPickable = false; // Clicks pass through to the ground

        const mat = new StandardMaterial('player-mat', scene);
        mat.diffuseColor = new Color3(0.3, 0.6, 1.0);
        mat.emissiveColor = new Color3(0.05, 0.1, 0.3);
        mesh.material = mat;

        this.mesh = mesh;

        // Grab the clickTarget set by WorldScene's onPointerDown
        this._target = (scene as any).clickTarget ?? null;
    }

    /** Called every frame by the WorldScene render loop */
    public update(deltaTime: number, scene: Scene): void {
        if (!this.mesh) return;

        // Lazily grab the clickTarget once it exists on the scene.
        // This avoids the spawn-order timing issue where clickTarget
        // doesn't exist yet when spawn() is called.
        if (!this._target) {
            this._target = (scene as any).clickTarget ?? null;
        }

        if (!this._target || !this._target.hasTarget) return;

        const pos = this.mesh.position;
        const dx = this._target.x - pos.x;
        const dz = this._target.z - pos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > STOP_THRESHOLD) {
            // ── Move at constant speed ──
            const step = Math.min(this.stats.speed * deltaTime, dist);
            pos.x += (dx / dist) * step;
            pos.z += (dz / dist) * step;

            // ── Rotate to face movement direction ──
            const targetAngle = Math.atan2(dx, dz);
            let currentAngle = this.mesh.rotation.y;
            let delta = targetAngle - currentAngle;

            // Clamp delta to shortest arc (-π … +π)
            if (delta > Math.PI) delta -= Math.PI * 2;
            if (delta < -Math.PI) delta += Math.PI * 2;

            this.mesh.rotation.y += delta * Math.min(ROTATION_SPEED * deltaTime, 1);
        } else {
            // Reached destination
            this._target.hasTarget = false;
        }
    }

    /** Convenience accessor for world position */
    public get position(): Vector3 {
        return this.mesh?.position ?? Vector3.Zero();
    }

    /** Apply damage and return whether the player is still alive */
    public takeDamage(amount: number): boolean {
        this.stats.hp = Math.max(0, this.stats.hp - amount);
        return this.stats.hp > 0;
    }

    /** Heal the player up to their max HP */
    public heal(amount: number): void {
        this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + amount);
    }
}
