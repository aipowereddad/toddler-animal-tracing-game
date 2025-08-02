// ===== FILE: main.ts =====
// [SECTION_ID]: canvas-init-main
// Purpose: Initialize the full-screen canvas and kick off the game loop

import { DEBUG_MODE } from './config/settings';
import { startGameLoop } from './core/gameLoop';

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
});
