// ===== FILE: mode1.ts =====
// [SECTION_ID]: mode1-scene-animation
// Purpose: Handles "Practice" mode where the child traces one animal at a time

import { startTracking, stopTracking, drawOutline, isTraceAccurate, Point } from '../core/traceEngine';
import { DEBUG_MODE } from '../config/settings';

let ctx: CanvasRenderingContext2D;
let currentOutline: Point[] = [];
let animating = false;

/**
 * Initializes Mode 1 on the provided canvas.
 */
export function startMode1(canvas: HTMLCanvasElement): void {
  ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  canvas.addEventListener('touchend', onTraceEnd);

  loadNextAnimal();
  startTracking(canvas);
}

/**
 * Loads the next animal outline (placeholder square for now).
 */
function loadNextAnimal(): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  currentOutline = [
    { x: 100, y: 100 },
    { x: 200, y: 100 },
    { x: 200, y: 200 },
    { x: 100, y: 200 },
  ];
  drawOutline(ctx, currentOutline);
}

/**
 * Called when the player's finger lifts off the screen.
 * Checks the trace and triggers the exit animation if successful.
 */
function onTraceEnd(): void {
  if (animating) {
    return;
  }

  const tracedPath = stopTracking();
  if (isTraceAccurate(currentOutline, tracedPath)) {
    animateExit();
  } else {
    // Allow the child to try again
    startTracking(ctx.canvas);
  }
}

/**
 * Animates the current outline off-screen to the right.
 */
function animateExit(): void {
  animating = true;
  let offset = 0;

  const step = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.translate(offset, 0);
    drawOutline(ctx, currentOutline);
    ctx.restore();
    offset += 15;

    if (offset > ctx.canvas.width) {
      animating = false;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      if (DEBUG_MODE) {
        console.log('✅ Trace complete – animal exited');
      }
      loadNextAnimal();
      startTracking(ctx.canvas);
    } else {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}
