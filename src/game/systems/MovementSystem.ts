import { Scene } from '@babylonjs/core';
import { Entity } from '../entities/Entity';

/**
 * MovementSystem — centralizes the per-frame update() tick for all
 * active entities in the scene (Player, NPCs, Monsters, etc.).
 *
 * Usage in WorldScene:
 *   const movement = new MovementSystem();
 *   movement.register(player);
 *   movement.register(npc);
 *   // in registerBeforeRender:
 *   movement.update(dt, scene);
 */
export class MovementSystem {
    private _entities: Map<string, Entity> = new Map();

    /** Add an entity to the update roster */
    public register(entity: Entity): void {
        if (this._entities.has(entity.id)) return;
        this._entities.set(entity.id, entity);
        console.log(`[MovementSystem] Registered: ${entity.type} (${entity.id})`);
    }

    /** Remove an entity — call this on entity death or scene change */
    public unregister(entity: Entity): void {
        this._entities.delete(entity.id);
        console.log(`[MovementSystem] Unregistered: ${entity.type} (${entity.id})`);
    }

    /**
     * Tick all registered entities.
     * Called once per frame from the WorldScene renderBeforeRender loop.
     * @param deltaTime — seconds since last frame (already dt-corrected)
     * @param scene     — current Babylon.js scene
     */
    public update(deltaTime: number, scene: Scene): void {
        for (const entity of this._entities.values()) {
            if (entity.active) {
                entity.update(deltaTime, scene);
            }
        }
    }

    /** True if this entity is currently registered */
    public has(entity: Entity): boolean {
        return this._entities.has(entity.id);
    }

    /** How many entities are currently tracked */
    public get count(): number {
        return this._entities.size;
    }

    /** Unregister and dispose all entities (used on scene cleanup) */
    public disposeAll(): void {
        for (const entity of this._entities.values()) {
            entity.dispose();
        }
        this._entities.clear();
    }
}
