/**
 * ============================================================================
 * CHRONICLES OF G - ASSET LOADER
 * ============================================================================
 * A centralized resource management system using BABYLON.AssetsManager.
 * Handles loading of meshes, textures, and sounds with progress tracking.
 */

export class AssetLoader {
    /** @type {BABYLON.AssetsManager} */
    manager;

    /**
     * @param {import('./engine.js').Engine} engine - Reference to the core engine.
     * @param {BABYLON.Scene} scene - The scene to associate the assets with.
     */
    constructor(engine, scene) {
        this.engine = engine;
        this.manager = new BABYLON.AssetsManager(scene);

        // Configure manager behavior
        this.manager.useDefaultLoadingScreen = false; // We use our own UI/Debug logs

        this.manager.onTaskSuccessObservable.add((task) => {
            this.engine.debug?.log(`Asset loaded: ${task.name}`, 'system');
        });

        this.manager.onTaskErrorObservable.add((task) => {
            this.engine.debug?.logError(`Failed to load asset tasks: ${task.name}`);
        });

        this.engine.debug?.logSystemInit('Asset Loader');
    }

    /**
     * Adds a mesh task to the loader.
     * @param {string} name 
     * @param {string|string[]} meshNames 
     * @param {string} rootUrl 
     * @param {string} sceneFilename 
     */
    addMesh(name, meshNames, rootUrl, sceneFilename) {
        return this.manager.addMeshTask(name, meshNames, rootUrl, sceneFilename);
    }

    /**
     * Adds a texture task to the loader.
     * @param {string} name 
     * @param {string} url 
     */
    addTexture(name, url) {
        return this.manager.addTextureTask(name, url);
    }

    /**
     * Adds a binary task (e.g., for sounds).
     * @param {string} name 
     * @param {string} url 
     */
    addBinary(name, url) {
        return this.manager.addBinaryFileTask(name, url);
    }

    /**
     * Starts the loading process for all added tasks.
     * @returns {Promise<void>}
     */
    async loadAll() {
        this.engine.debug?.log('Starting asset load queue...', 'system');

        return new Promise((resolve, reject) => {
            this.manager.onFinish = (tasks) => {
                this.engine.debug?.log('All assets loaded successfully', 'system');
                resolve(tasks);
            };

            this.manager.onTaskErrorObservable.add((err) => {
                reject(err);
            });

            this.manager.load();
        });
    }
}
