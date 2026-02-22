import { Scene, MeshBuilder, StandardMaterial, Color3, Vector3 } from '@babylonjs/core';
import { Entity } from './Entity';

export interface NpcData {
    name: string;
    /** Dialogue ID to trigger when the player interacts with this NPC */
    dialogueId: string;
    /** Optional quest the NPC is related to */
    questId?: string;
}

const INTERACTION_RADIUS = 3; // Units — how close the player must be to interact

export class NPC extends Entity {
    public data: NpcData;

    /** Whether the player is currently close enough to interact */
    public isInRange: boolean = false;

    constructor(data: NpcData) {
        super('npc', ['interactable', 'friendly', 'collidable']);
        this.data = data;
    }

    /**
     * Spawn the NPC mesh into the scene at the given world position.
     * Placeholder: a slightly shorter, gold-coloured capsule.
     */
    public spawn(scene: Scene, position: Vector3 = Vector3.Zero()): void {
        const HEIGHT = 1.7;

        const mesh = MeshBuilder.CreateCapsule(
            `npc_${this.data.name}`,
            { radius: 0.35, height: HEIGHT, tessellation: 12 },
            scene
        );
        mesh.position = new Vector3(position.x, HEIGHT / 2, position.z);
        mesh.isPickable = true; // NPCs should be clickable for interaction later

        const mat = new StandardMaterial(`npc-mat-${this.data.name}`, scene);
        mat.diffuseColor = new Color3(1.0, 0.8, 0.3);  // Gold placeholder
        mat.emissiveColor = new Color3(0.3, 0.2, 0.0);
        mesh.material = mat;

        this.mesh = mesh;
    }

    /**
     * Called every frame.
     * Checks proximity to the player so the InteractionSystem
     * can show/hide the "Press E to talk" prompt.
     */
    public update(_deltaTime: number, scene: Scene): void {
        if (!this.mesh) return;

        // Find the player mesh to check distance
        const playerMesh = scene.getMeshByName('player');
        if (!playerMesh) return;

        const dist = Vector3.Distance(this.mesh.position, playerMesh.position);
        this.isInRange = dist <= INTERACTION_RADIUS;
    }

    /** Called by the InteractionSystem when the player presses E */
    public interact(): NpcData {
        console.log(`💬 Interacting with NPC: ${this.data.name}`);
        return this.data;
    }

    /** Expose interaction radius for debug/visualisation */
    public get interactionRadius(): number {
        return INTERACTION_RADIUS;
    }
}
