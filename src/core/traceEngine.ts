// ===== FILE: traceEngine.ts =====
// [SECTION_ID]: finger-input-tracking
// Purpose: Track finger input on the canvas and record the path traced by the user

import { DEBUG_MODE } from '../config/settings';

/** A point on the canvas */
export interface Point {
  x: number;
  y: number;
}

// Keep the canvas reference so we can remove listeners later
let activeCanvas: HTMLCanvasElement | null = null;

// Holds the points traced by the user's finger
let tracePath: Point[] = [];

// Flag to indicate when the child is tracing
let isTracing = false;

/**
 * Starts listening for finger input on the given canvas.
 * A new empty path is created on touchstart.
 */
export function startTracking(canvas: HTMLCanvasElement): void {
  activeCanvas = canvas;

  // When the child touches the screen, begin a new path
  canvas.addEventListener('touchstart', handleTouchStart);
  // Add points as the finger moves across the screen
  canvas.addEventListener('touchmove', handleTouchMove);
  // Finish the path when the finger lifts off the screen
  canvas.addEventListener('touchend', handleTouchEnd);
}

/**
 * Stops listening for finger input and returns the path that was traced.
 */
export function stopTracking(): Point[] {
  if (!activeCanvas) {
    return tracePath;
  }

  activeCanvas.removeEventListener('touchstart', handleTouchStart);
  activeCanvas.removeEventListener('touchmove', handleTouchMove);
  activeCanvas.removeEventListener('touchend', handleTouchEnd);

  const completedPath = tracePath;

  if (DEBUG_MODE) {
    console.log(`[TRACE] Tracking stopped with ${completedPath.length} points`);
  }

  activeCanvas = null;
  return completedPath;
}

/** Returns the current finger path */
export function getTracePath(): Point[] {
  return tracePath;
}

/**
 * Handle the start of a touch event.
 * Clears the previous path and records the first point.
 */
function handleTouchStart(event: TouchEvent): void {
  if (!activeCanvas) {
    return;
  }

  isTracing = true;
  tracePath = [];

  const touch = event.touches[0];
  const rect = activeCanvas.getBoundingClientRect();
  tracePath.push({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });

  if (DEBUG_MODE) {
    console.log('[TRACE] Started new path');
  }
}

/**
 * Handle finger movement across the screen.
 * Each move adds a point to the path array.
 */
function handleTouchMove(event: TouchEvent): void {
  if (!isTracing || !activeCanvas) {
    return;
  }

  const touch = event.touches[0];
  const rect = activeCanvas.getBoundingClientRect();
  tracePath.push({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
}

/**
 * Handle the end of a touch event.
 * Stops tracking and optionally logs the number of points collected.
 */
function handleTouchEnd(): void {
  if (!isTracing) {
    return;
  }

  isTracing = false;

  if (DEBUG_MODE) {
    console.log(`[TRACE] Finger lifted with ${tracePath.length} points`);
  }

  // Automatically stop tracking to remove listeners
  stopTracking();
}

