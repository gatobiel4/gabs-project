# Core Engine Systems: Babylon.js Architecture for Antigravity

This document outlines the core architectural systems of the Babylon.js engine, specifically adapted for the **Antigravity** project.

---

## 1. Low-Level Foundation (The Browser Bridge)
In the context of Antigravity, these systems manage the interface between the web browser and the GPU.

* **Engine & ThinEngine:** The `ThinEngine` acts as the hardware abstraction layer (HAL) for WebGL and WebGPU. `Engine` adds high-level features like the render loop and audio.
* **Math Library:** High-performance classes (`Vector3`, `Matrix`, `Quaternion`) optimized to reduce Garbage Collection (GC) overhead by using "to-ref" methods.
* **Assets Manager:** The `BABYLON.AssetsManager` handles asynchronous loading for `.gltf` ships, textures, and UI assets.

## 2. The Simulation Loop (The Heartbeat)
Antigravity relies on a deterministic loop to ensure consistent racing physics regardless of frame rate.

* **Render Loop:** `engine.runRenderLoop()` triggers the frame update.
* **Delta Time:** Used to scale object movement: `scene.getAnimationRatio()`.
* **Observables:** The event system (`onBeforeRenderObservable`) used to process player input and ship logic before the frame is drawn.

## 3. High-Level Runtime Systems
The pillars that define the visual and physical experience of Antigravity.

### A. Rendering Pipeline
* **PBR Materials:** Used for metallic ship surfaces and environmental reflections.
* **Glow Layer & Post-Processing:** Essential for the "neon" aesthetic and motion blur.
* **Culling:** The engine automatically handles Frustum and Octree culling to maintain 60+ FPS.

### B. Physics (The Antigravity Core)
* **Havok Plugin:** The primary physics engine for high-performance collision and gravity manipulation.
* **Raycasting:** Crucial for calculating the "hover" height of ships relative to the track.

### C. Animation & Input
* **AnimationGroups:** Handles ship thruster effects and mechanical parts.
* **DeviceSourceManager:** Bridges Gamepads, Keyboard, and Touch inputs into a unified stream.

---

## 4. Antigravity Mapping Table

| Standard System | Babylon.js System | Project Role |
| :--- | :--- | :--- |
| **Graphics** | WebGL2 / WebGPU | Visual rendering & Shaders |
| **Physics** | HavokPlugin | Ship buoyancy & Collisions |
| **GUI** | BABYLON.GUI | Speedometers & HUD overlays |
| **Audio** | Babylon Audio Engine | Spatial engine hums & Music |
| **Logic** | Behaviors / Scripts | Ship handling & AI Pathing |

---
---
*Generated for the Antigravity Project Development Team.*

## 🛠️ Development Roadmap

### Phase 0: Engine Infrastructure (Unity-Inspired) 🏛️
- [x] **Lifecycle Management**: Implement `Awake`, `Start`, `Update`, and `LateUpdate` hooks.
- [x] **Component System**: Establish a modular "Script" registration system for `GameObjects`.
- [x] **DeltaTime Core**: Ensure frame-independent logic is baked into the main loop.
- [ ] **Input Manager**: Create a centralized system for handling Keyboard, Mouse, and Gamepad states.
- [ ] **Asset Loader**: Build a Unity-like `Resources` system for loading `.glb`, textures, and sounds.
- [x] **Scene Management**: Implement logic for switching between different scenes (Menu, Level 1, etc.).
- [x] **Rendering Pipeline**: Integrated Default Rendering Pipeline (Bloom, Antialiasing, MSAA).
- [x] **Version Control**: Auto-incrementing SemVer `vX.Y.Z #A` with Git integration.
- [x] **Debug Console**: Real-time event monitoring with toggle button and log export functionality.

### Phase 1: Core RPG Systems ⚔️
- [ ] **Character Controller**: Implementation of movement, animations, and gravity.
- [ ] **Combat System**: Basic melee/magic combat and health management.
- [ ] **Inventory & Items**: Item collection and inventory UI system.
- [ ] **NPC & Dialogues**: Interaction system with interactive dialogues.
- [ ] **Level Design**: Creation of the first playable map with environment assets.
- [ ] **Save System**: Local storage for character progress and inventory.
