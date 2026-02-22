# Development_plan — Checklist (TypeScript + Babylon.js + React RPG)

Use this checklist to track progress. Mark items as you complete them.

---

## 1) Setup & Tooling
- [x] Create repository (Git) and initialize project (Vite + React + TS)
- [x] Install Babylon.js
- [x] Add ESLint + Prettier
- [x] Choose state management (Zustand or Redux Toolkit)
- [x] Add Zod for data validation
- [x] Create base folder structure (`src/game`, `src/state`, etc.)
- [x] Confirm dev server runs and hot reload works

---

## 2) React + Babylon Integration
- [x] Build `<BabylonCanvas />` with canvas ref
- [x] Initialize `Engine` + `Scene` on mount
- [x] Implement window resize handling
- [x] Implement full cleanup (dispose engine/scene on unmount)
- [x] Add basic FPS / debug logging
- [x] Create `SceneManager` abstraction
- [x] Switch between `WorldScene` and `CharacterCreateScene`

---

## 3) Camera + World Base
- [x] Implement isometric camera (ArcRotateCamera with fixed angle)
- [x] Lock rotation and clamp zoom min/max
- [x] Implement smooth follow (lerp target)
- [x] Add ground plane (flat color or texture)
- [x] Add debug grid / markers for scale testing
- [x] Add basic lighting (simple and cheap)

---

## 4) Player Movement
- [x] Implement mouse picking (`scene.pick`) on ground
- [x] Convert pick to target point
- [x] Move player towards target (constant speed)
- [x] Rotate player to face movement direction
- [x] Add movement stop threshold
- [ ] (Optional) Add WASD input

---

## 5) Entities & Systems
- [x] Create `Entity` base model (id/type/mesh/tags/update)
- [x] Create `Player` entity
- [x] Create `NPC` entity
- [x] Create `Monster` entity
- [x] Create `MovementSystem`
- [ ] Create `InteractionSystem` *(deferred → Step 6)*
- [ ] Create `CombatSystem` (stub) *(deferred → Step 10)*
- [ ] Create `QuestSystem` (stub) *(deferred → Step 12)*

---

## 6) Interaction
- [ ] Add proximity detection for NPC interaction
- [ ] Add interact prompt (React overlay)
- [ ] Implement “Press E” interaction trigger
- [ ] Open dialogue UI on interaction
- [ ] Add interaction for an object (chest/door)

---

## 7) UI (React)
- [ ] Main Menu screen
- [ ] Character Creation screen
- [ ] HUD (HP/MP/Level)
- [ ] Inventory window
- [ ] Dialogue window
- [ ] Quest log
- [ ] Pause/Settings menu
- [ ] Wire UI state through Zustand/Redux

---

## 8) Data-Driven RPG (JSON)
- [ ] Create `races.json`
- [ ] Create `classes.json`
- [ ] Create `items.json`
- [ ] Create `skills.json`
- [ ] Create `quests.json`
- [ ] Define Zod schemas for all data
- [ ] Implement data loader + validation at startup
- [ ] Implement `CharacterFactory` to compute final stats
- [ ] Connect character creation to spawn configured player

---

## 9) Inventory & Equipment
- [ ] Implement inventory data model (definitions + instances)
- [ ] Implement pickup items in-world
- [ ] Implement inventory UI list
- [ ] Implement equipment slots
- [ ] Equip/unequip items
- [ ] Stats update based on equipped gear
- [ ] Add item tooltips (optional)

---

## 10) Combat (Pick one first)
### Option A: Simple Real-Time
- [ ] Enemy HP + collider
- [ ] Player attack + cooldown
- [ ] Distance check and damage application
- [ ] Enemy chase AI
- [ ] Enemy death + loot drop

### Option B: Simple Turn-Based
- [ ] Enter battle mode/scene
- [ ] Turn queue
- [ ] Actions: attack/skill/item
- [ ] Damage resolution and end-of-battle flow

---

## 11) AI
- [ ] Create enemy state machine (Idle/Patrol/Chase/Attack)
- [ ] Implement detection radius
- [ ] Implement patrol path (optional)
- [ ] Implement chase behavior
- [ ] Implement attack behavior
- [ ] Add flee behavior (optional)

---

## 12) Dialogue & Quests
- [ ] Define dialogue format (nodes/options/conditions/effects)
- [ ] Implement dialogue runner (apply effects)
- [ ] Implement quest flags
- [ ] Implement quest log updates
- [ ] Build 1 complete “fetch quest”

---

## 13) Save/Load
- [ ] Define save format (versioned)
- [ ] Save player data (stats/inventory/equipment/position)
- [ ] Save quest flags
- [ ] Save world state (opened chests, defeated enemies)
- [ ] Implement Load and restore everything correctly
- [ ] Choose storage (localStorage or IndexedDB)

---

## 14) Vertical Slice (15–30 minutes)
- [ ] Build 1 town area
- [ ] Add 3 NPCs
- [ ] Add 1 small dungeon
- [ ] Add 3 enemy types
- [ ] Add 5 items
- [ ] Add 1 boss
- [ ] Add 1 quest chain
- [ ] Add polish: audio/particles/feedback

---

## 15) Performance & Polish
- [ ] Replace repeated props with instancing/thin instances
- [ ] Reduce dynamic lights
- [ ] Optimize materials and texture sizes
- [ ] Add minimap (optional)
- [ ] Add settings (audio, controls, graphics)
- [ ] Add accessibility options (font size, contrast)

---

## 16) Desktop Packaging
- [ ] Decide: Tauri or Electron
- [ ] Create desktop wrapper project
- [ ] Configure build pipeline for desktop
- [ ] Test filesystem access (if needed)
- [ ] Ship a desktop build from the same codebase
