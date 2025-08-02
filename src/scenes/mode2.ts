// ===== FILE: mode2.ts =====
// [SECTION_ID]: intermediate-mode-multitrace
// Purpose: Handles "Intermediate" mode where 2–3 animals can be traced in any order

// [AI_EDIT] 2025-08-03 - Added .js extensions for browser module support
import {
  startTracking,
  updateTrace,
  endTracking,
  drawOutline,
  isTraceAccurate,
  loadAnimalOutline,
  Point,
} from '../core/traceEngine.js';
import { DEBUG_MODE } from '../config/settings.js';
// [AI_EDIT] 2025-08-03 - Added mouse listeners for tracing

/** Represents one animal currently on the screen */
interface ActiveAnimal {
  /** Short name used to load the asset */
  name: string;
  /** Outline points already shifted to the animal's position */
  outline: Point[];
  /** Position offset applied to the outline */
  offset: Point;
  /** Last trace path that completed this animal */
  trace: Point[];
  /** True while the animal is animating off-screen */
  animating?: boolean;
}

// Canvas drawing context
let ctx: CanvasRenderingContext2D;

// Animals currently visible
let activeAnimals: ActiveAnimal[] = [];

// Total number of completed traces in this session
let totalCompleted = 0;

// Ordered list of available animal outlines
const animalNames = ['lion', 'elephant', 'giraffe', 'monkey'];
let nextAnimalIndex = 0;

/**
 * Starts Intermediate mode on the provided canvas.
 */
export function startMode2(canvas: HTMLCanvasElement): void {
  ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  canvas.addEventListener('touchstart', startTracking);
  canvas.addEventListener('touchmove', updateTrace);
  canvas.addEventListener('touchend', onTraceEnd);
  canvas.addEventListener('mousedown', startTracking);
  canvas.addEventListener('mousemove', updateTrace);
  canvas.addEventListener('mouseup', onTraceEnd);

  void loadInitialAnimals();
}

// ===== SECTION: mode-wrappers-export =====
// [SECTION_ID]: mode-wrappers-export
// Purpose: Expose a simple wrapper to launch game modes externally

/**
 * Wrapper to start Intermediate Mode — multi-animal tracing mode.
 */
export function startIntermediateMode(canvas: HTMLCanvasElement): void {
  if (DEBUG_MODE) {
    console.log('▶️ Intermediate Mode started');
  }
  return startMode2(canvas);
}

// [AI_EDIT] 2025-02-20 - Added intermediate mode wrapper for external launch

/**
 * Loads 2 or 3 animals and draws them spaced apart on the canvas.
 */
async function loadInitialAnimals(): Promise<void> {
  const count = 2 + Math.floor(Math.random() * 2); // 2 or 3 animals
  const offsets = computeOffsets(count);
  activeAnimals = new Array(count);

  for (let i = 0; i < count; i++) {
    const name = getNextAnimalName();
    const points = await loadAnimalOutline(name);
    const offset = offsets[i];
    const shifted = points.map((p) => ({ x: p.x + offset.x, y: p.y + offset.y }));
    activeAnimals[i] = { name, outline: shifted, offset, trace: [] };
  }

  redrawAll();
}

/**
 * Calculates positions for each animal so they don't overlap.
 * count: number of animals to place
 */
function computeOffsets(count: number): Point[] {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const spacing = width / (count + 1);
  const offsets: Point[] = [];

  for (let i = 0; i < count; i++) {
    const baseX = spacing * (i + 1) - 100;
    const baseY = height / 2 - 100;
    offsets.push({
      x: baseX + (Math.random() * 40 - 20),
      y: baseY + (Math.random() * 40 - 20),
    });
  }

  return offsets;
}

/**
 * Cycles through the animal name list in order.
 */
function getNextAnimalName(): string {
  const name = animalNames[nextAnimalIndex];
  nextAnimalIndex = (nextAnimalIndex + 1) % animalNames.length;
  return name;
}

/**
 * Clears and redraws all active animal outlines.
 * animated: optional info for an animal that is moving off-screen
 */
function redrawAll(animated?: { index: number; shift: number }): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  activeAnimals.forEach((animal, idx) => {
    ctx.save();
    if (animated && idx === animated.index) {
      ctx.translate(animated.shift, 0);
    }
    drawOutline(ctx, animal.outline);
    ctx.restore();
  });
}

/**
 * Called when the pointer lifts off the screen.
 * Checks the trace against each animal outline.
 */
function onTraceEnd(event: MouseEvent | TouchEvent): void {
  if (activeAnimals.some((a) => a.animating)) {
    return;
  }

  const path = endTracking(event);

  for (let i = 0; i < activeAnimals.length; i++) {
    const animal = activeAnimals[i];
    if (isTraceAccurate(animal.outline, path)) {
      animal.trace = path;
      animateAndReplace(i);
      return;
    }
  }
}

/**
 * Animates the traced animal off-screen and loads a new one in its place.
 */
function animateAndReplace(index: number): void {
  const animal = activeAnimals[index];
  animal.animating = true;
  let shift = 0;

  const step = () => {
    redrawAll({ index, shift });
    shift += 15;

    if (shift > ctx.canvas.width) {
      totalCompleted++;
      if (DEBUG_MODE) {
        console.log(`🐾 Traced: ${animal.name} | Total completed: ${totalCompleted}`);
      }
      void loadAnimalIntoSlot(index).then(() => {
        activeAnimals[index].animating = false;
        redrawAll();
      });
    } else {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

/**
 * Loads a new animal into an existing slot.
 * index: which slot to replace
 */
async function loadAnimalIntoSlot(index: number): Promise<void> {
  const baseOffset = activeAnimals[index].offset;
  const name = getNextAnimalName();
  const points = await loadAnimalOutline(name);
  const jitteredOffset = {
    x: baseOffset.x + (Math.random() * 20 - 10),
    y: baseOffset.y + (Math.random() * 20 - 10),
  };
  const shifted = points.map((p) => ({ x: p.x + jitteredOffset.x, y: p.y + jitteredOffset.y }));
  activeAnimals[index] = { name, outline: shifted, offset: jitteredOffset, trace: [] };
}

// [AI_EDIT] 2025-02-18 - Implemented intermediate mode with multi-animal tracing
