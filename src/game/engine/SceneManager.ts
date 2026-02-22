import { Engine, Scene } from '@babylonjs/core';

export class SceneManager {
    private engine: Engine;
    private currentScene: Scene | null = null;
    private scenes: Map<string, (engine: Engine) => Scene>;

    constructor(engine: Engine) {
        this.engine = engine;
        this.scenes = new Map();
    }

    public registerScene(name: string, sceneFactory: (engine: Engine) => Scene) {
        this.scenes.set(name, sceneFactory);
    }

    public switchToScene(name: string) {
        if (!this.scenes.has(name)) {
            console.error(`Scene ${name} not found`);
            return;
        }

        // Dispose old scene to free rendering resources
        if (this.currentScene) {
            this.currentScene.dispose();
        }

        // Create new scene from factory
        const factory = this.scenes.get(name)!;
        this.currentScene = factory(this.engine);
    }

    public render() {
        if (this.currentScene) {
            this.currentScene.render();
        }
    }

    public dispose() {
        if (this.currentScene) {
            this.currentScene.dispose();
            this.currentScene = null;
        }
        this.scenes.clear();
    }
}
