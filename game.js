import { Engine } from './engine.js';

/**
 * Chronicles of G - Entry Point
 */

window.addEventListener('DOMContentLoaded', async () => {
    const gameEngine = new Engine("renderCanvas", true); // Debug mode enabled

    // Create the primary scene (initializes AssetLoader)
    gameEngine.createScene("MainLevel");

    // Initializing the Unity-like lifecycle
    await gameEngine.awake();
    await gameEngine.start();
});
