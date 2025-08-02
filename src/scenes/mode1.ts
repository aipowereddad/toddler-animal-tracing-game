// ===== FILE: mode1.ts =====
// [SECTION_ID]: mode1-scene-animation
// Purpose: Handles "Practice" mode where the child traces one animal at a time

import {
  startTracking,
  stopTracking,
  drawOutline,
  isTraceAccurate,
  Point,
} from '../core/traceEngine';
import { DEBUG_MODE } from '../config/settings';
import {
  showDebugPanel,
  updateTraceCount,
  clearDebugPanel,
} from '../ui/debugPanel';

let ctx: CanvasRenderingContext2D;
let currentOutline: Point[] = [];
let animating = false;
let traceCount = 0;

// ===== SECTION: practice-mode-reward-tracking =====
// [SECTION_ID]: practice-mode-reward-tracking
// Purpose: Track stars earned in this practice session and display them
let completedCount = 0;
let starDisplay: HTMLDivElement | null = null;

// ===== SECTION: practice-mode-animal-cycle =====
// [SECTION_ID]: practice-mode-animal-cycle
// Purpose: Cycle through placeholder animal outlines for practice mode

/** Local list of simple placeholder animals */
const animals: Point[][] = [
  // shape-1: square
  [
    { x: 100, y: 100 },
    { x: 200, y: 100 },
    { x: 200, y: 200 },
    { x: 100, y: 200 },
  ],
  // shape-2: triangle
  [
    { x: 150, y: 50 },
    { x: 250, y: 200 },
    { x: 50, y: 200 },
  ],
  // shape-3: circle approximation
  [
    { x: 150, y: 50 },
    { x: 200, y: 75 },
    { x: 225, y: 125 },
    { x: 200, y: 175 },
    { x: 150, y: 200 },
    { x: 100, y: 175 },
    { x: 75, y: 125 },
    { x: 100, y: 75 },
  ],
];

// Index of the next animal to load
let animalIndex = 0;

/**
 * Initializes Mode 1 on the provided canvas.
 */
export function startMode1(canvas: HTMLCanvasElement): void {
  ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  canvas.addEventListener('touchend', onTraceEnd);
  canvas.addEventListener('touchstart', onTraceStart);
  canvas.addEventListener('touchmove', onTraceMove);

  setupRewardDisplay(canvas);
  loadNextAnimal();
  startTracking(canvas);
}

/**
 * Loads the next animal outline from the local placeholder list.
 */
function loadNextAnimal(): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  currentOutline = animals[animalIndex];

  if (DEBUG_MODE) {
    console.log(`👉 Loading next animal: shape-${animalIndex + 1}`);
  }

  drawOutline(ctx, currentOutline);

  traceCount = 0;
  showDebugPanel({
    mode: 'Practice',
    animal: `shape-${animalIndex + 1}`,
    tracePoints: traceCount,
  });

  animalIndex = (animalIndex + 1) % animals.length;
}

/**
 * Creates the on-screen star counter if it doesn't exist.
 * canvas: HTMLCanvasElement where Mode 1 is running
 */
function setupRewardDisplay(canvas: HTMLCanvasElement): void {
  if (starDisplay) {
    return;
  }
  if (canvas.parentElement) {
    canvas.parentElement.style.position = 'relative';
  }
  starDisplay = document.createElement('div');
  starDisplay.id = 'practice-star-counter';
  starDisplay.textContent = 'Stars: 0';
  starDisplay.style.position = 'absolute';
  starDisplay.style.top = '10px';
  starDisplay.style.left = '10px';
  starDisplay.style.fontFamily = 'sans-serif';
  starDisplay.style.fontSize = '20px';
  starDisplay.style.color = '#ffcc00';
  starDisplay.style.transform = 'scale(1)';
  starDisplay.style.transition = 'transform 0.3s ease';
  canvas.parentElement?.appendChild(starDisplay);
}

/**
 * Increments the star count and updates the counter with a small pop effect.
 */
function rewardEarned(): void {
  completedCount++;
  if (starDisplay) {
    starDisplay.textContent = `Stars: ${completedCount}`;
    starDisplay.style.transform = 'scale(1.3)';
    setTimeout(() => {
      if (starDisplay) {
        starDisplay.style.transform = 'scale(1)';
      }
    }, 300);
  }
  if (DEBUG_MODE) {
    console.log(`⭐ Total stars earned: ${completedCount}`);
  }
}

// [AI_EDIT] 2025-02-15 - Added star reward tracking overlay

/**
 * Resets the trace counter when the child begins a new touch.
 */
function onTraceStart(): void {
  traceCount = 0;
  updateTraceCount(traceCount);
}

/**
 * Tracks how many points the child has drawn in this attempt.
 */
function onTraceMove(): void {
  traceCount++;
  updateTraceCount(traceCount);
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
      clearDebugPanel();
      rewardEarned();
      setTimeout(() => {
        loadNextAnimal();
        startTracking(ctx.canvas);
      }, 500);
    } else {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

// [AI_EDIT] 2025-02-17 - Hooked debug overlay into practice mode
