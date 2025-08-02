// ===== FILE: traceEngine.ts =====
// [SECTION_ID]: finger-input-tracking
// Purpose: Track finger input on the canvas and record the path traced by the user
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DEBUG_MODE, TRACE_DISTANCE_THRESHOLD, SOUND_ENABLED, } from '../config/settings';
// Keep the canvas reference so we can remove listeners later
let activeCanvas = null;
// Holds the points traced by the user's finger
let tracePath = [];
// Flag to indicate when the child is tracing
let isTracing = false;
// ===== SECTION: sound-effects =====
// [SECTION_ID]: trace-sound-effects
// Purpose: Provide audio feedback for trace interactions
/** Sound played when tracing begins */
const startSound = new Audio('src/assets/sounds/traceStart.mp3');
/** Sound played when a trace is successfully matched */
const successSound = new Audio('src/assets/sounds/traceSuccess.mp3');
/**
 * Plays the provided sound if sound effects are enabled.
 */
function playSound(sound) {
    if (!SOUND_ENABLED) {
        return;
    }
    sound.currentTime = 0;
    sound.play().catch(() => {
        /* ignore playback failures */
    });
    if (DEBUG_MODE) {
        console.log(`[SOUND] Played ${sound.src.split('/').pop()}`);
    }
}
/**
 * Starts listening for finger input on the given canvas.
 * A new empty path is created on touchstart.
 */
export function startTracking(canvas) {
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
export function stopTracking() {
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
// ===== SECTION: render-outline =====
// [SECTION_ID]: render-outline
// Purpose: Draw placeholder animal outlines on the canvas
/** Bright color used for sample outlines */
const OUTLINE_COLOR = '#ff8800';
/** Width of the outline stroke */
const OUTLINE_WIDTH = 6;
/**
 * Draws an outline path on the canvas.
 * points: array of {x, y} describing the shape. If empty, a simple square is used.
 */
export function drawOutline(ctx, points) {
    // If no points are provided, use a default square shape as a stand-in animal
    const shape = points.length
        ? points
        : [
            { x: 100, y: 100 },
            { x: 200, y: 100 },
            { x: 200, y: 200 },
            { x: 100, y: 200 },
        ];
    // Set a toddler-friendly stroke style
    ctx.strokeStyle = OUTLINE_COLOR;
    ctx.lineWidth = OUTLINE_WIDTH;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    // Begin the outline path
    ctx.beginPath();
    ctx.moveTo(shape[0].x, shape[0].y);
    // Connect each point to form the outline
    for (let i = 1; i < shape.length; i++) {
        ctx.lineTo(shape[i].x, shape[i].y);
    }
    // Close the path and draw it to the screen
    ctx.closePath();
    ctx.stroke();
    // Helpful debug output for developers
    if (DEBUG_MODE) {
        console.log('Animal outline rendered');
    }
}
/** Returns the current finger path */
export function getTracePath() {
    return tracePath;
}
/**
 * Handle the start of a touch event.
 * Clears the previous path and records the first point.
 */
function handleTouchStart(event) {
    if (!activeCanvas) {
        return;
    }
    isTracing = true;
    tracePath = [];
    playSound(startSound);
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
function handleTouchMove(event) {
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
function handleTouchEnd() {
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
// ===== SECTION: trace-validation =====
// [SECTION_ID]: trace-validation
// Purpose: Compare the player's trace against the target outline and determine accuracy
// [AI_EDIT] 2025-08-02 - Implemented trace accuracy checking
/**
 * Determines if a user's trace is close enough to the outline to count as correct.
 * outline: array of outline points
 * userPath: array of points traced by the player
 * Returns true if at least 80% of the user's points are near the outline
 */
export function isTraceAccurate(outline, userPath) {
    // Early exit if there is nothing to compare
    if (outline.length === 0 || userPath.length === 0) {
        return false;
    }
    // Square of the allowed distance for quick comparisons
    const thresholdSq = TRACE_DISTANCE_THRESHOLD * TRACE_DISTANCE_THRESHOLD;
    // Keep track of how many user points are close enough to the outline
    let hitCount = 0;
    // Outline index advances as we find matches to avoid checking the full list
    let outlineIndex = 0;
    // Limit how far ahead we scan within the outline for each user point
    const searchWindow = 10;
    for (const p of userPath) {
        let found = false;
        // Only check a small range of outline points for performance
        for (let i = outlineIndex; i < outline.length && i < outlineIndex + searchWindow; i++) {
            const dx = p.x - outline[i].x;
            const dy = p.y - outline[i].y;
            if (dx * dx + dy * dy <= thresholdSq) {
                hitCount++;
                outlineIndex = i; // move forward to this match
                found = true;
                break;
            }
        }
        if (!found && outlineIndex > 0) {
            // allow slight backtracking by checking previous points once
            for (let j = outlineIndex - 1; j >= 0 && outlineIndex - j <= searchWindow; j--) {
                const dx2 = p.x - outline[j].x;
                const dy2 = p.y - outline[j].y;
                if (dx2 * dx2 + dy2 * dy2 <= thresholdSq) {
                    hitCount++;
                    outlineIndex = j;
                    break;
                }
            }
        }
    }
    // Calculate how many of the user's points were close to the outline
    const accuracy = hitCount / userPath.length;
    const percent = Math.round(accuracy * 100);
    const passed = accuracy >= 0.8;
    if (DEBUG_MODE) {
        const status = passed ? 'SUCCESS' : 'TRY AGAIN';
        console.log(`[TRACE] Trace accuracy: ${percent}% – ${status}`);
    }
    if (passed) {
        playSound(successSound);
    }
    return passed;
}
// ===== SECTION: load-animal-outline =====
// [SECTION_ID]: load-animal-outline
// Purpose: Load animal outlines from JSON files
/**
 * Loads an animal outline from the assets folder.
 * name: short animal identifier (e.g. 'lion')
 * Returns: Promise resolving to an array of {x, y} points.
 */
export function loadAnimalOutline(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`assets/animals/${name}.json`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const points = yield response.json();
            if (DEBUG_MODE) {
                console.log(`✅ Loaded animal: ${name} with ${points.length} points`);
            }
            return points;
        }
        catch (_a) {
            console.log(`⚠️ Failed to load animal: ${name}`);
            return [];
        }
    });
}
// [AI_EDIT] 2025-02-18 - Added animal outline loader
