/**
 * ============================================================================
 * CHRONICLES OF G - CORE ENGINE
 * ============================================================================
 * A Unity-inspired game engine foundation built on top of Babylon.js.
 * Implements a modular lifecycle (Awake, Start, Update, LateUpdate) and
 * centralized system management.
 */

import { DebugConsole } from './debug.js';
import { AssetLoader } from './assets.js';

export class Engine {
    // -------------------------------------------------------------------------
    // PROPERTIES
    // -------------------------------------------------------------------------

    /** @type {HTMLCanvasElement} */
    canvas;

    /** @type {BABYLON.Engine} */
    babylonEngine;

    /** @type {BABYLON.Scene} */
    activeScene;

    /** @type {Map<string, BABYLON.Scene>} */
    scenes = new Map();

    /** @type {Array<Object>} */
    scripts = [];

    /** @type {DebugConsole} */
    debug = null;

    /** @type {AssetLoader} */
    assets = null;

    // -------------------------------------------------------------------------
    // CONSTRUCTOR
    // -------------------------------------------------------------------------

    /**
     * @param {string} canvasId - The ID of the HTML canvas element.
     * @param {boolean} debugMode - Enable debug console.
     */
    constructor(canvasId, debugMode = false) {
        this.canvas = document.getElementById(canvasId);

        // Initialize Babylon Engine with high-fidelity defaults
        this.babylonEngine = new BABYLON.Engine(this.canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            antialias: true
        });

        this.activeScene = null;

        // Initialize Debug Console
        this.debug = new DebugConsole(debugMode);
        if (debugMode) {
            this.debug.logSystemInit('Babylon.js Engine');
            this.fetchVersion();
        }
    }

    /**
     * Fetches and logs the engine version from version.json
     */
    async fetchVersion() {
        try {
            const response = await fetch('./version.json');
            const data = await response.json();
            const version = `v${data.major}.${data.minor}.${data.patch} #${data.build}`;
            this.debug?.log(`Project Version: ${version}`, 'system');
        } catch (e) {
            this.debug?.logWarning('Could not load version.json');
        }
    }

    // -------------------------------------------------------------------------
    // LIFECYCLE METHODS
    // -------------------------------------------------------------------------

    /**
     * AWAKE: Initialization of core engine systems and registered scripts.
     * Called once at the very beginning.
     */
    async awake() {
        this.debug?.logLifecycle('AWAKE');
        this.debug?.logSystemInit('Component Registry');

        // Universal event handlers (Input Management)
        window.addEventListener("resize", () => {
            this.babylonEngine.resize();
        });
        this.debug?.logSystemInit('Input Manager (Resize & Keys)');

        // Initialize all registered components
        for (const script of this.scripts) {
            if (script.awake) {
                await script.awake();
                this.debug?.log(`Component Awakened: ${script.constructor.name}`, 'system');
            }
        }
    }

    /**
     * START: Logic to run after all objects are "Awake".
     * Called once before the first frame of the render loop.
     */
    async start() {
        this.debug?.logLifecycle('START');

        for (const script of this.scripts) {
            if (script.start) {
                await script.start();
                this.debug?.log(`Script started: ${script.constructor.name}`, 'system');
            }
        }

        // Initialize the Main Render Loop
        this.debug?.logSystemInit('Main Render Loop');
        this.babylonEngine.runRenderLoop(() => {
            if (this.activeScene) {
                this.update();
                this.activeScene.render();
                this.lateUpdate();
            }
        });
    }

    /**
     * UPDATE: Per-frame logic.
     * Passes a frame-independent 'deltaTime'.
     */
    update() {
        const deltaTime = this.babylonEngine.getDeltaTime() / 1000.0;
        for (const script of this.scripts) {
            if (script.update) script.update(deltaTime);
        }
    }

    /**
     * LATE UPDATE: Post-render/update logic.
     * Ideal for camera tracking systems.
     */
    lateUpdate() {
        for (const script of this.scripts) {
            if (script.lateUpdate) script.lateUpdate();
        }
    }

    // -------------------------------------------------------------------------
    // SCENE MANAGEMENT
    // -------------------------------------------------------------------------

    /**
     * Creates a new managed Babylon.js scene.
     * @param {string} name - The unique identifier for this scene.
     * @returns {BABYLON.Scene}
     */
    createScene(name) {
        const scene = new BABYLON.Scene(this.babylonEngine);
        this.scenes.set(name, scene);
        this.debug?.log(`Scene created: ${name}`, 'system');

        // Set as active if it's the first scene
        if (!this.activeScene) {
            this.activeScene = scene;
            this.debug?.log(`Active scene set to: ${name}`, 'system');

            // Initialize Asset Loader with the primary scene
            this.assets = new AssetLoader(this, scene);
            this.debug?.logSystemInit('Resource Management System');
        }

        return scene;
    }

    /**
     * Switches the active rendering scene.
     * @param {string} name - The name of the scene to activate.
     */
    setScene(name) {
        if (this.scenes.has(name)) {
            this.activeScene = this.scenes.get(name);
            this.debug?.log(`Scene switched to: ${name}`, 'system');
        } else {
            this.debug?.logError(`Scene "${name}" does not exist`);
        }
    }

    // -------------------------------------------------------------------------
    // COMPONENT SYSTEM
    // -------------------------------------------------------------------------

    /**
     * Registers a Unity-style script/component to the engine lifecycle.
     * @param {Object} script - Object containing Awake/Start/Update methods.
     * @returns {Object} The registered script.
     */
    addScript(script) {
        // Provide standard references to the component
        script.engine = this;
        script.babylonEngine = this.babylonEngine;
        script.canvas = this.canvas;
        script.assets = this.assets;

        this.scripts.push(script);
        this.debug?.log(`Script registered: ${script.constructor.name}`, 'system');
        return script;
    }

    // -------------------------------------------------------------------------
    // RENDERING SYSTEMS
    // -------------------------------------------------------------------------

    /**
     * Initializes the default Post-Processing Pipeline.
     * Features: Bloom, MSAA, and high-quality filtering.
     * @returns {BABYLON.DefaultRenderingPipeline | null}
     */
    initDefaultPipeline() {
        if (!this.activeScene) return null;

        const pipeline = new BABYLON.DefaultRenderingPipeline(
            "defaultPipeline",
            true,
            this.activeScene,
            this.activeScene.cameras
        );

        // Quality Controls
        pipeline.samples = 4; // Use 4x MSAA
        pipeline.bloomEnabled = true;
        pipeline.bloomThreshold = 0.8;
        pipeline.bloomWeight = 0.3;

        this.debug?.logSystemInit('Default Rendering Pipeline');
        return pipeline;
    }
}
