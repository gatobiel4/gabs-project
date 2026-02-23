import { Scene, MeshBuilder, StandardMaterial, Color3, Vector3, SceneLoader, AnimationGroup } from '@babylonjs/core';
import '@babylonjs/loaders/glTF'; // Registers GLB/glTF support
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

const STOP_THRESHOLD = 0.15;
const ROTATION_SPEED = 10;

const MODEL_PATH = '/assets/models/GLB format/';
const MODEL_FILE = 'character-male-d.glb';

export class Player extends Entity {
    public stats: PlayerStats;

    // Internal animation state
    private _animations: Record<string, AnimationGroup> = {};
    private _currentAnimName: string | null = null;

    private _target: { x: number; y: number; z: number; hasTarget: boolean } | null = null;

    constructor(stats: Partial<PlayerStats> = {}) {
        super('player', ['collidable']);
        this.stats = { ...DEFAULT_STATS, ...stats };
    }

    /**
     * Spawn the player into the scene.
     * Creates an invisible root mesh immediately (so movement works at once),
     * then asynchronously loads the GLB and parents it to the root.
     */
    public spawn(scene: Scene, position: Vector3 = Vector3.Zero()): void {
        // ── Root mesh — movement pivot, always exists ──────────────
        const root = MeshBuilder.CreateBox('player', { size: 0.01 }, scene);
        root.position = new Vector3(position.x, 0, position.z);
        root.isPickable = false;
        root.isVisible = false; // Invisible — the GLB child provides visuals
        this.mesh = root;

        // ── Load GLB asynchronously ────────────────────────────────
        SceneLoader.ImportMeshAsync('', MODEL_PATH, MODEL_FILE, scene)
            .then(result => {
                const modelRoot = result.meshes[0]; // The GLB root node

                // Parent the model to our root pivot
                modelRoot.parent = root;
                modelRoot.position = Vector3.Zero();
                modelRoot.scaling = new Vector3(1, 1, 1);
                modelRoot.rotation = Vector3.Zero(); // No flip — face forward naturally

                // Make all sub-meshes non-pickable (clicks go through to ground)
                result.meshes.forEach(m => { m.isPickable = false; });

                // ── Animations ───────────────────────────────────────
                if (result.animationGroups.length > 0) {
                    // Populate local dictionary
                    result.animationGroups.forEach(ag => {
                        this._animations[ag.name.toLowerCase()] = ag;
                        ag.stop(); // Stop all by default
                    });

                    // Start idle
                    this.playAnimation('idle');
                } else {
                    console.warn('[Player] No animation groups found in GLB.');
                }

                console.log(`[Player] Model loaded: ${MODEL_FILE}`);
            })
            .catch(err => {
                console.warn(`[Player] Failed to load GLB, falling back to capsule:`, err);

                // Fallback — show the old blue capsule if loading fails
                const fallback = MeshBuilder.CreateCapsule(
                    'player-fallback',
                    { radius: 0.4, height: 1.8, tessellation: 12 },
                    scene
                );
                fallback.parent = root;
                fallback.position = new Vector3(0, 0.9, 0);
                fallback.isPickable = false;

                const mat = new StandardMaterial('player-mat', scene);
                mat.diffuseColor = new Color3(0.3, 0.6, 1.0);
                mat.emissiveColor = new Color3(0.05, 0.1, 0.3);
                fallback.material = mat;
            });

        // Grab clickTarget set by WorldScene
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

            this.playAnimation('walk');
        } else {
            // Reached destination
            this._target.hasTarget = false;
            this.playAnimation('idle');
        }
    }

    /** Ensure a smooth transition between animations */
    private playAnimation(name: string): void {
        if (this._currentAnimName === name) return; // Already playing

        const newAnim = this._animations[name];
        if (!newAnim) return; // Doesn't exist

        const oldAnim = this._currentAnimName ? this._animations[this._currentAnimName] : null;

        if (oldAnim) {
            // Stop old animation smoothly
            oldAnim.stop();
        }

        newAnim.play(true); // Loop
        this._currentAnimName = name;
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
