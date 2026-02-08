/**
 * ============================================================================
 * CHRONICLES OF G - PHYSICS MANAGER
 * ============================================================================
 * A helper system for managing Havok Physics V2 aggregates.
 */

export class PhysicsManager {
    /**
     * @param {BABYLON.Scene} scene - The scene to apply physics to.
     */
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * Adds a box physics aggregate to a mesh.
     * @param {BABYLON.Mesh} mesh 
     * @param {number} mass 
     * @param {number} restitution 
     * @param {number} friction 
     */
    addBox(mesh, mass = 1, restitution = 0.5, friction = 0.5) {
        return new BABYLON.PhysicsAggregate(
            mesh,
            BABYLON.PhysicsShapeType.BOX,
            { mass, restitution, friction },
            this.scene
        );
    }

    /**
     * Adds a sphere physics aggregate to a mesh.
     * @param {BABYLON.Mesh} mesh 
     * @param {number} mass 
     * @param {number} restitution 
     * @param {number} friction 
     */
    addSphere(mesh, mass = 1, restitution = 0.5, friction = 0.5) {
        return new BABYLON.PhysicsAggregate(
            mesh,
            BABYLON.PhysicsShapeType.SPHERE,
            { mass, restitution, friction },
            this.scene
        );
    }

    /**
     * Adds a plane physics aggregate to a mesh.
     * @param {BABYLON.Mesh} mesh 
     * @param {number} restitution 
     * @param {number} friction 
     */
    addGround(mesh, restitution = 0.5, friction = 0.5) {
        return new BABYLON.PhysicsAggregate(
            mesh,
            BABYLON.PhysicsShapeType.BOX, // Plane used as box with 0 mass
            { mass: 0, restitution, friction },
            this.scene
        );
    }
}
