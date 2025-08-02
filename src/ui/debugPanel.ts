// ===== FILE: debugPanel.ts =====
// [SECTION_ID]: debug-overlay-mode1
// Purpose: Display a developer overlay with live game information

import { DEBUG_MODE } from '../config/settings';

/** Information shown on the debug panel */
interface DebugInfo {
  /** Name of the current game mode (e.g. "Practice") */
  mode: string;
  /** Name or index of the animal being traced */
  animal: string;
  /** Number of trace points collected so far */
  tracePoints: number;
}

// Cached DOM references for quick updates
let panel: HTMLDivElement | null = null;
let traceLabel: HTMLSpanElement | null = null;
let animalLabel: HTMLSpanElement | null = null;
let fpsLabel: HTMLSpanElement | null = null;
let fpsLoopId: number | null = null;

/**
 * Creates the overlay if needed and populates it with the provided info.
 * info: Details about the current mode and animal
 */
export function showDebugPanel(info: DebugInfo): void {
  if (!DEBUG_MODE) {
    return;
  }

  // Create the panel only once
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'debug-overlay';
    panel.style.position = 'fixed';
    panel.style.top = '0';
    panel.style.left = '0';
    panel.style.background = 'rgba(0, 0, 0, 0.5)';
    panel.style.color = '#0ff';
    panel.style.fontFamily = 'monospace';
    panel.style.fontSize = '12px';
    panel.style.padding = '4px 8px';
    panel.style.zIndex = '1000';
    panel.style.pointerEvents = 'none';

    panel.innerHTML =
      'Mode: <span id="dbg-mode"></span><br>' +
      'Animal: <span id="dbg-animal"></span><br>' +
      'Trace Points: <span id="dbg-trace"></span><br>' +
      'FPS: <span id="dbg-fps">0</span>';

    document.body.appendChild(panel);

    traceLabel = panel.querySelector('#dbg-trace') as HTMLSpanElement;
    animalLabel = panel.querySelector('#dbg-animal') as HTMLSpanElement;
    fpsLabel = panel.querySelector('#dbg-fps') as HTMLSpanElement;
    const modeLabel = panel.querySelector('#dbg-mode') as HTMLSpanElement;
    modeLabel.textContent = info.mode;

    startFPSCounter();
  }

  // Update dynamic fields
  animalLabel!.textContent = info.animal;
  traceLabel!.textContent = info.tracePoints.toString();
}

/**
 * Updates the trace point count displayed on the panel.
 * count: number of points collected in the current trace
 */
export function updateTraceCount(count: number): void {
  if (!DEBUG_MODE || !traceLabel) {
    return;
  }
  traceLabel.textContent = count.toString();
}

/**
 * Removes the debug overlay and stops the FPS loop.
 */
export function clearDebugPanel(): void {
  if (!DEBUG_MODE || !panel) {
    return;
  }
  if (fpsLoopId !== null) {
    cancelAnimationFrame(fpsLoopId);
    fpsLoopId = null;
  }
  panel.remove();
  panel = null;
  traceLabel = null;
  animalLabel = null;
  fpsLabel = null;
}

/**
 * Starts a loop that updates the FPS display every second.
 */
function startFPSCounter(): void {
  let lastTime = performance.now();
  let frames = 0;

  const loop = (now: number) => {
    frames++;
    if (now - lastTime >= 1000) {
      if (fpsLabel) {
        fpsLabel.textContent = frames.toString();
      }
      frames = 0;
      lastTime = now;
    }
    fpsLoopId = requestAnimationFrame(loop);
  };

  fpsLoopId = requestAnimationFrame(loop);
}

// [AI_EDIT] 2025-02-17 - Implemented debug overlay for Mode 1
