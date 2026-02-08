import { Engine } from './engine.js';

/**
 * Chronicles of G - Entry Point
 */

window.addEventListener('DOMContentLoaded', async () => {
    const gameEngine = new Engine("renderCanvas", true); // Debug mode enabled

    // Initializing the Unity-like lifecycle from a clean state
    await gameEngine.awake();
    await gameEngine.start();
});
