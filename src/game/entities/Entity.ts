import { AbstractMesh, Scene } from '@babylonjs/core';

// All possible entity types in the game
export type EntityType = 'player' | 'npc' | 'monster' | 'item' | 'trigger';

// Tags allow systems to quickly filter entities
// e.g., only entities tagged 'interactable' trigger the interaction prompt
export type EntityTag =
    | 'interactable'
    | 'hostile'
    | 'friendly'
    | 'collidable'
    | 'lootable';

/**
 * Base class for every game entity (Player, NPC, Monster, etc.)
 * All entities share: a unique ID, a type, an optional mesh, 
 * a set of tags, and an update() tick called every frame.
 */
export abstract class Entity {
    /** Unique identifier — generated once on creation */
    public readonly id: string;

    /** What kind of entity this is */
    public readonly type: EntityType;

    /** The Babylon.js mesh representing this entity in the 3D world.
     *  May be null if the entity has no visual representation. */
    public mesh: AbstractMesh | null = null;

    /** Tags for quick system filtering */
    public tags: Set<EntityTag>;

    /** Whether this entity should be ticked each frame */
    public active: boolean = true;

    constructor(type: EntityType, tags: EntityTag[] = []) {
        this.id = Entity.generateId();
        this.type = type;
        this.tags = new Set(tags);
    }

    /**
     * Called every frame by the game loop.
     * @param deltaTime — seconds elapsed since last frame
     * @param scene     — the current Babylon scene
     */
    public abstract update(deltaTime: number, scene: Scene): void;

    /**
     * Called when the entity is removed from the world.
     * Override to clean up meshes, listeners, timers, etc.
     */
    public dispose(): void {
        if (this.mesh) {
            this.mesh.dispose();
            this.mesh = null;
        }
    }

    /** Check if this entity has a specific tag */
    public hasTag(tag: EntityTag): boolean {
        return this.tags.has(tag);
    }

    /** Add a tag at runtime */
    public addTag(tag: EntityTag): void {
        this.tags.add(tag);
    }

    /** Remove a tag at runtime */
    public removeTag(tag: EntityTag): void {
        this.tags.delete(tag);
    }

    // ── Private Helpers ──────────────────────────────────────────
    private static _counter = 0;
    private static generateId(): string {
        return `entity_${++Entity._counter}_${Date.now()}`;
    }
}
