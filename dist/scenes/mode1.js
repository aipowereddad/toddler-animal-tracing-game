// ===== FILE: mode1.ts =====
// [SECTION_ID]: mode1-scene-animation
// Purpose: Handles "Practice" mode where the child traces one animal at a time
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { startTracking, stopTracking, drawOutline, isTraceAccurate, loadAnimalOutline, } from '../core/traceEngine';
import { DEBUG_MODE } from '../config/settings';
import { showDebugPanel, updateTraceCount, clearDebugPanel, } from '../ui/debugPanel';
let ctx;
let currentOutline = [];
let animating = false;
let traceCount = 0;
// ===== SECTION: practice-mode-reward-tracking =====
// [SECTION_ID]: practice-mode-reward-tracking
// Purpose: Track stars earned in this practice session and display them
let completedCount = 0;
let starDisplay = null;
// ===== SECTION: practice-mode-animal-cycle =====
// [SECTION_ID]: practice-mode-animal-cycle
// Purpose: Cycle through real animal outlines loaded from assets
/** Ordered list of animal outline file names */
const animalNames = ['lion', 'elephant', 'giraffe', 'monkey'];
// Index of the next animal to load
let animalIndex = 0;
/**
 * Initializes Mode 1 on the provided canvas.
 */
export function startMode1(canvas) {
    ctx = canvas.getContext('2d');
    canvas.addEventListener('touchend', onTraceEnd);
    canvas.addEventListener('touchstart', onTraceStart);
    canvas.addEventListener('touchmove', onTraceMove);
    setupRewardDisplay(canvas);
    void loadNextAnimal().then(() => {
        startTracking(canvas);
    });
}
// ===== SECTION: mode-wrappers-export =====
// [SECTION_ID]: mode-wrappers-export
// Purpose: Expose a simple wrapper to launch game modes externally
/**
 * Wrapper to start Practice Mode — single-animal tracing mode.
 */
export function startPracticeMode(canvas) {
    if (DEBUG_MODE) {
        console.log('▶️ Practice Mode started');
    }
    return startMode1(canvas);
}
// [AI_EDIT] 2025-02-20 - Added practice mode wrapper for external launch
/**
 * Loads the next animal outline from assets and draws it.
 */
function loadNextAnimal() {
    return __awaiter(this, void 0, void 0, function* () {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        let attempts = 0;
        while (attempts < animalNames.length) {
            const name = animalNames[animalIndex];
            const points = yield loadAnimalOutline(name);
            animalIndex = (animalIndex + 1) % animalNames.length;
            if (points.length > 0) {
                currentOutline = points;
                if (DEBUG_MODE) {
                    console.log(`👉 Loading next animal: ${name}`);
                }
                drawOutline(ctx, currentOutline);
                traceCount = 0;
                showDebugPanel({
                    mode: 'Practice',
                    animal: name,
                    tracePoints: traceCount,
                });
                return;
            }
            attempts++;
        }
    });
}
/**
 * Creates the on-screen star counter if it doesn't exist.
 * canvas: HTMLCanvasElement where Mode 1 is running
 */
function setupRewardDisplay(canvas) {
    var _a;
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
    (_a = canvas.parentElement) === null || _a === void 0 ? void 0 : _a.appendChild(starDisplay);
}
/**
 * Increments the star count and updates the counter with a small pop effect.
 */
function rewardEarned() {
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
function onTraceStart() {
    traceCount = 0;
    updateTraceCount(traceCount);
}
/**
 * Tracks how many points the child has drawn in this attempt.
 */
function onTraceMove() {
    traceCount++;
    updateTraceCount(traceCount);
}
/**
 * Called when the player's finger lifts off the screen.
 * Checks the trace and triggers the exit animation if successful.
 */
function onTraceEnd() {
    if (animating) {
        return;
    }
    const tracedPath = stopTracking();
    if (isTraceAccurate(currentOutline, tracedPath)) {
        animateExit();
    }
    else {
        // Allow the child to try again
        startTracking(ctx.canvas);
    }
}
/**
 * Animates the current outline off-screen to the right.
 */
function animateExit() {
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
                void loadNextAnimal().then(() => {
                    startTracking(ctx.canvas);
                });
            }, 800);
        }
        else {
            requestAnimationFrame(step);
        }
    };
    requestAnimationFrame(step);
}
// [AI_EDIT] 2025-02-18 - Replaced placeholder shapes with real animal outlines
// [AI_EDIT] 2025-02-17 - Hooked debug overlay into practice mode
