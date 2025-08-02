# Project Rules – Toddler Animal Outlining Game

## Purpose
Define the standards and best practices for building and maintaining the Toddler Animal Outlining Game. Designed for non-developers collaborating with AI to build a mobile-friendly, browser-based game for toddlers.

---

## 1. Language & Framework
- Use **TypeScript**.
- Use **Canvas API** or **SVG**, not both in the same render path.
- No frameworks unless critically needed (vanilla JS preferred).

---

## 2. Code Organization
### Folder Structure
```
src/
  core/          # game loop, state mgmt
  assets/        # .svg, .json, .mp3
  scenes/        # Mode1.ts, Mode2.ts, etc.
  ui/            # buttons, overlays
  utils/         # helpers, math
  config/        # game settings, constants
  tests/         # unit test files
```

### File Headers
Each file should start with a comment block:
```ts
// ===== FILE: traceEngine.ts =====
// [SECTION_ID]: trace-handler-core
// Purpose: Handles user touch input and compares path to target outline
```

---

## 3. Commenting Guidelines
- All functions must have clear comment blocks.
- Explain what the function does, its inputs, and what it returns.
- Use plain English. Assume the reader is **not a developer**.

Example:
```ts
/**
 * Starts tracking a child's finger as they trace the animal.
 * animalId: string (e.g. 'lion-001')
 */
function startTrace(animalId: string) {
  // Begin tracking where the child touches the screen
}
```

---

## 4. Unique Identifiers
- Every asset, game object, or UI component should have a readable, unique ID.
- Examples:
  - `id="trace-canvas-mode1"`
  - `ANIMAL_LION_001`, `BACKGROUND_JUNGLE_001`

Used for: ChatGPT code referencing, debugging, and targeted updates.

---

## 5. Game Config
Create a single global config file:
- Color palette
- Trace tolerance (easy/medium/hard)
- Frame rate targets
- Debug mode toggle
```ts
const DEBUG_MODE = true;
```

---

## 6. Debug Panel
- Tapping 5 times in a corner enables a debug overlay showing:
  - Current mode
  - Active animal
  - FPS
  - Trace progress
  - Toggle audio / view logs

---

## 7. Testing & Logs
- Console logs must be clear and prefixed with [TAG]
- Optional unit test files in `/tests/`

---

## 8. AI Integration Rules
If using ChatGPT or similar AI agents:
- Always reference the correct `[SECTION_ID]` before editing
- Never overwrite entire files unless explicitly asked
- Leave a comment like:
```ts
// [AI_EDIT] 2025-08-02 - Updated tolerance logic in trace-handler-core
```

---

## 9. Out-of-Scope for MVP
- No user login
- No database
- No AR or camera features (Phase 2+ only)
