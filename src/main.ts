// ===== FILE: main.ts =====
// [SECTION_ID]: canvas-init-main
// Purpose: Initialize the full-screen canvas and kick off the game loop

import { DEBUG_MODE } from './config/settings';
import { startGameLoop } from './core/gameLoop';
import { startPracticeMode } from './scenes/mode1';

/**
 * Configures the on-page canvas to fill the screen.
 * Shows a debug banner if DEBUG_MODE is true.
 */
function setupCanvas(): HTMLCanvasElement {
  const canvas = document.getElementById('trace-game-canvas') as HTMLCanvasElement;
  document.body.style.margin = '0';

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

// ===== SECTION: start-button-menu-setup =====
// [SECTION_ID]: ui-start-button-menu
// Purpose: Handle Start button click and hide menu
function setupMenu(canvas: HTMLCanvasElement): void {
  const button = document.getElementById('start-btn') as HTMLButtonElement | null;
  if (!button) {
    console.error('[UI] Start button not found');
    return;
  }
  button.addEventListener('click', () => {
    startPracticeMode(canvas);
    const menu = document.getElementById('menu');
    if (menu) {
      menu.style.display = 'none';
    }
  });
}

// Wait for the page to load before initializing
window.addEventListener('load', () => {
  const canvas = setupCanvas();
  startGameLoop(canvas);
  setupMenu(canvas);
});
