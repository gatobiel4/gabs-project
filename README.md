# Chronicles of G: A Babylon.js RPG

Welcome to the **Chronicles of G**, an immersive role-playing game (RPG) built from the ground up using the powerful **Babylon.js** engine. This project leverages modern web technologies to deliver a high-performance, visually stunning 3D experience directly in the browser.

---

## 📝 Description

**Chronicles of G** is a next-generation web-based RPG. The game aims to blend classic RPG elements—deep storytelling, character progression, and world exploration—with the accessibility and power of the modern web. Utilizing **Babylon.js** for 3D rendering, we are creating a world where every shadow, texture, and animation brings the player closer to the adventure.

---

## 🛠️ Development Plan

### Phase 0: Engine Infrastructure (Unity-Inspired) 🏛️
- [x] **Lifecycle Management**: Implement `Awake`, `Start`, `Update`, and `LateUpdate` hooks.
- [ ] **Component System**: Establish a modular "Script" registration system for `GameObjects`.
- [x] **DeltaTime Core**: Ensure frame-independent logic is baked into the main loop.
- [ ] **Input Manager**: Create a centralized system for handling Keyboard, Mouse, and Gamepad states.
- [ ] **Asset Loader**: Build a Unity-like `Resources` system for loading `.glb`, textures, and sounds.
- [x] **Scene Management**: Implement logic for switching between different scenes (Menu, Level 1, etc.).
- [x] **Rendering Pipeline**: Integrated Default Rendering Pipeline (Bloom, Antialiasing, MSAA).
- [x] **Version Control**: Auto-incrementing SemVer `vX.Y.Z #A` with Git integration.
- [x] **Debug Console**: Real-time event monitoring with toggle button and log export functionality.

---

## 🚀 Project Flow

The **Chronicles of G** engine follows a strict architectural pipeline inspired by professional game engines like Unity, ensuring predictable execution and modularity.

### 1. Engine Bootstrap
*   **Entry**: `index.html` loads `game.js` as a module.
*   **Instantiation**: The `Engine` class initializes the Babylon.js core, enabling hardware acceleration and stencil/antialias buffers.

### 2. Initialization Phase
*   **Registration**: Global systems and game scripts are registered via `gameEngine.addScript()`.
*   **Awake**: The engine triggers `awake()` on all components. This is the stage for internal variable initialization and scene creation (`createScene`).

### 3. Execution Phase
*   **Start**: Triggered once after all Awake calls. Used for cross-script communication or logic that requires a fully loaded world.

### 4. The Main Loop (Real-Time)
The engine maintains a high-performance loop executing the following order every frame:
*   **Update**: Logic, physics, and input processing (uses frame-independent `deltaTime`).
*   **Render**: The active `BABYLON.Scene` is computed and drawn to the viewport.
*   **LateUpdate**: Executed post-render; ideal for camera smoothing and UI synchronization.

### 5. Debug Console (Development Tool)
*   **Toggle Button**: A "DEBUG" button (bottom-right) shows/hides the console overlay.
*   **Real-Time Logging**: Monitors all lifecycle events, system initialization, and errors with timestamps.
*   **Export Functionality**: Download complete logs as `consolelog_YYYY-MM-DD_HH-MM-SS.txt` for debugging.
*   **Color-Coded**: Info (gray), Warnings (orange), Errors (red), System (cyan), Lifecycle (magenta).

---

## 📜 Patch Notes

### v0.1.0 #1 - 2026-02-08
- Initialized version control system and automated commit workflow.
- Established SemVer vX.Y.Z #A format.

---

## 👥 Credits

- **Lead Developer**: @gatobiel4
- **Engine**: [Babylon.js](https://www.babylonjs.com/)
- **Assets**: TBD

---

*“The journey of a thousand miles begins with a single line of code.”*
