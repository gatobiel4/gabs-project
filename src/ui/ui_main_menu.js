/**
 * ============================================================================
 * CHRONICLES OF G - MAIN MENU UI
 * ============================================================================
 * Handles the graphical interface for the game's home screen.
 */

export class MainMenuUI {
    /** @type {BABYLON.GUI.AdvancedDynamicTexture} */
    uiTexture;

    constructor() {
        this.uiTexture = null;
    }

    async awake() {
        const scene = this.engine.activeScene;

        // 1. Scene Setup (Essential for rendering)
        // Babylon.js needs a camera to render any GUI
        if (scene.cameras.length === 0) {
            const camera = new BABYLON.FreeCamera("menuCamera", new BABYLON.Vector3(0, 0, -10), scene);
            camera.setTarget(BABYLON.Vector3.Zero());
        }

        // Solid background to make text readable
        scene.clearColor = new BABYLON.Color4(0.05, 0.05, 0.1, 1);

        // 2. UI Creation
        this.uiTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

        // Title Text
        const title = new BABYLON.GUI.TextBlock();
        title.text = "CHRONICLES OF G";
        title.color = "white";
        title.fontSize = 64;
        title.fontFamily = "Comic Sans MS";
        title.fontWeight = "bold";

        // Define dimensions for precise centering
        title.width = "100%";
        title.height = "200px";
        title.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        title.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

        this.uiTexture.addControl(title);

        this.engine.debug?.log("Main Menu UI Visible (Camera & BG Set)", "system");
    }
}
