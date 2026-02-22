import { Scene, MeshBuilder, StandardMaterial, Color3, Vector3 } from '@babylonjs/core';
import { Entity } from './Entity';

/** Static template data for a monster type (loaded from JSON in Step 8) */
export interface MonsterData {
    name: string;
    maxHp: number;
    attack: number;
    defense: number;
    speed: number;
    /** XP granted to the player on death */
    xpReward: number;
    /** Detection radius — how close the player must be to trigger chase */
    detectionRadius: number;
    /** Attack range — must be within this distance to deal damage */
    attackRange: number;
}

/** AI state machine states — expanded fully in Step 11 */
export type MonsterState = 'idle' | 'chase' | 'attack' | 'dead';

const DEFAULT_DATA: MonsterData = {
    name: 'Goblin',
    maxHp: 30,
    attack: 5,
    defense: 2,
    speed: 3,
    xpReward: 20,
    detectionRadius: 8,
    attackRange: 1.5,
};

export class Monster extends Entity {
    public data: MonsterData;
    public hp: number;
    public state: MonsterState = 'idle';

    constructor(data: Partial<MonsterData> = {}) {
        super('monster', ['hostile', 'collidable']);
        this.data = { ...DEFAULT_DATA, ...data };
        this.hp = this.data.maxHp;
    }

    /**
     * Spawn the monster into the scene at the given position.
     * Placeholder: a shorter, dark-red angular box for a menacing look.
     */
    public spawn(scene: Scene, position: Vector3 = Vector3.Zero()): void {
        const HEIGHT = 1.4;

        // Use a box to look visually different from NPCs and the player
        const mesh = MeshBuilder.CreateBox(
            `monster_${this.id}`,
            { width: 0.8, height: HEIGHT, depth: 0.8 },
            scene
        );
        mesh.position = new Vector3(position.x, HEIGHT / 2, position.z);
        mesh.isPickable = true; // Clickable for combat targeting later

        const mat = new StandardMaterial(`monster-mat-${this.id}`, scene);
        mat.diffuseColor = new Color3(0.7, 0.1, 0.1);  // Dark red
        mat.emissiveColor = new Color3(0.2, 0.0, 0.0);
        mesh.material = mat;

        this.mesh = mesh;
    }

    /**
     * Called every frame — stub for the full AI state machine (Step 11).
     * For now just checks for the player and logs state transitions.
     */
    public update(_deltaTime: number, scene: Scene): void {
        if (!this.mesh || this.state === 'dead') return;

        const playerMesh = scene.getMeshByName('player');
        if (!playerMesh) return;

        const dist = Vector3.Distance(this.mesh.position, playerMesh.position);

        // Basic state transitions — AI movement implemented in Step 11
        if (dist <= this.data.attackRange) {
            if (this.state !== 'attack') {
                this.state = 'attack';
            }
        } else if (dist <= this.data.detectionRadius) {
            if (this.state !== 'chase') {
                this.state = 'chase';
            }
        } else {
            if (this.state !== 'idle') {
                this.state = 'idle';
            }
        }
    }

    /**
     * Apply damage to this monster.
     * Returns whether it is still alive.
     */
    public takeDamage(amount: number): boolean {
        if (this.state === 'dead') return false;

        const effective = Math.max(0, amount - this.data.defense);
        this.hp = Math.max(0, this.hp - effective);

        if (this.hp <= 0) {
            this.die();
            return false;
        }
        return true;
    }

    private die(): void {
        this.state = 'dead';
        console.log(`💀 ${this.data.name} [${this.id}] was defeated!`);
        // Full death handling (loot drop, animation) added in Step 10/11
        if (this.mesh) {
            // Briefly flash the mesh then dispose
            setTimeout(() => this.dispose(), 500);
        }
    }

    public get isAlive(): boolean {
        return this.state !== 'dead';
    }
}
