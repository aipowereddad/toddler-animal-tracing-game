// ===== FILE: main.ts =====
// [SECTION_ID]: canvas-init-main
// Purpose: Initialize the full-screen canvas and kick off the game loop

import { DEBUG_MODE } from './config/settings';
import { startGameLoop } from './core/gameLoop';
import { startPracticeMode } from './scenes/mode1';
import { startIntermediateMode } from './scenes/mode2';

/**
 * Creates a canvas element that fills the screen and resizes with the window.
 * Shows a debug banner if DEBUG_MODE is true.
 */
function setupCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.id = 'trace-game-canvas';
  document.body.style.margin = '0';
  document.body.appendChild(canvas);

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  if (DEBUG_MODE) {
    console.log('[DEBUG] Game started in debug mode');
    const banner = document.createElement('div');
    banner.id = 'debug-banner';
    banner.textContent = 'DEBUG MODE';
    banner.style.position = 'absolute';
    banner.style.top = '0';
    banner.style.left = '0';
    banner.style.background = 'rgba(255, 0, 0, 0.5)';
    banner.style.color = 'white';
    banner.style.padding = '4px 8px';
    banner.style.fontFamily = 'sans-serif';
    document.body.appendChild(banner);
  }

  return canvas;
}

// Wait for the page to load before initializing
window.addEventListener('load', () => {
  const canvas = setupCanvas();
  startGameLoop(canvas);

  // ===== SECTION: fallback-mode-autostart =====
  // [SECTION_ID]: fallback-mode-autostart
  // Purpose: Auto-start Practice Mode if no mode is selected manually
  const global = window as typeof window & {
    __modeStarted?: boolean;
    practiceMode?: () => void;
    intermediateMode?: () => void;
  };

  // Preserve any flag set before this script runs
  global.__modeStarted = global.__modeStarted ?? false;

  // Expose manual launchers for developer testing
  global.practiceMode = () => {
    global.__modeStarted = true;
    startPracticeMode(canvas);
  };
  global.intermediateMode = () => {
    global.__modeStarted = true;
    startIntermediateMode(canvas);
  };

  // [AI_EDIT] 2025-08-02 - Added fallback auto-start for Practice Mode

  // If no mode has been launched manually, start Practice Mode
  if (!global.__modeStarted) {
    if (DEBUG_MODE) {
      console.log('▶️ Auto-starting Practice Mode (fallback)');
    }
    global.practiceMode();
  }
});
