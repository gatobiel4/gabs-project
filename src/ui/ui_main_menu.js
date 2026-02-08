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

        // Create Fullscreen UI
        this.uiTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

        // Title Text
        const title = new BABYLON.GUI.TextBlock();
        title.text = "CHRONICLES OF G";
        title.color = "white";
        title.fontSize = 64;
        title.fontFamily = "Comic Sans MS"; // Requested font
        title.fontWeight = "bold";
        title.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        title.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

        // Dynamic centering using the main container
        this.uiTexture.addControl(title);

        this.engine.debug?.log("Main Menu UI Initialized with Comic Sans", "system");
    }
}
