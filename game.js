import { Engine } from './src/core/engine.js';
import { MainMenuUI } from './src/ui/ui_main_menu.js';

/**
 * Chronicles of G - Entry Point
 */

window.addEventListener('DOMContentLoaded', async () => {
    const gameEngine = new Engine("renderCanvas", true);

    // 1. Initial Scene Setup
    gameEngine.createScene("MainMenu");

    // 2. Main Menu UI
    gameEngine.addScript(new MainMenuUI());

    // Initializing the Unity-like lifecycle
    await gameEngine.awake();
    await gameEngine.start();
});
