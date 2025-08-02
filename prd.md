# Product Requirements Document (PRD)
## Project: Toddler Animal Outlining Game

---

## 1. Overview
A web-based, mobile-first tracing game where toddlers outline animals using touch. On successful tracing, the animal animates and runs off-screen.

---

## 2. Target User
- Toddlers aged 2–5
- Needs simple controls, low frustration
- Parents expect safety (no data, no login)

---

## 3. Platforms
- Web-based
- Responsive mobile-first layout
- Hosted on GitHub Pages

---

## 4. Core Game Loop
1. Show animal outline
2. Child traces with finger
3. App detects trace accuracy
4. If complete:
   - Animal animates
   - New one appears

---

## 5. Modes

### Mode 1: Practice
- 1 animal on screen
- Large, easy outlines
- Endless mode

### Mode 2: Intermediate
- 2–3 animals
- Slightly more complex
- Any order tracing

### Mode 3: Challenge
- 3–5 animals + timer
- Max animals in 2 minutes
- Countdown visuals/sounds

---

## 6. Visuals
- Cartoon-style
- Bright, readable, high contrast
- No realism or textures
- Subtle animated backgrounds
- Modern polish

---

## 7. Animations
- Each animal animates uniquely
- Examples: Elephant trumpets, lion roars
- Whimsical and short (<5 seconds)

---

## 8. Input Detection
- Touch only
- Tolerance level adjusts by mode
- Uses either Canvas or SVG path logic

---

## 9. Audio
- Sound FX for:
  - Tracing start
  - Completion
  - Animal celebration
  - Countdown near-zero
- Background music toggle

---

## 10. Reward System
- Sticker/stars appear per animal
- Themed sets (jungle, farm, ocean, dinos)
- Unlock “badge” when full set complete

---

## 11. Parental Features
- Optional session history
- Lock UI to prevent exit
- Volume and music toggles
- No ads, no analytics by default

---

## 12. Accessibility
- Colorblind-safe
- No reading required
- Icon or animation-based feedback

---

## 13. Tech Stack
- JavaScript/TypeScript
- Canvas API or SVG
- localStorage only (no backend)
- Touch gesture tracking
- GitHub Pages for hosting

---

## 14. Asset Types
- SVG or JSON vector paths for outlines
- .mp3 or .ogg audio
- Simple illustrated backgrounds
- CSS or JS animations

---

## 15. Phase 2 Ideas (not for MVP)
- Draw-your-own creature
- Seasonal themes (e.g. Halloween animals)
- AR overlay tracing mode
- Multi-touch co-op play

---

## 16. Developer-Independent Notes
- Code must be readable by non-dev (commented)
- All major logic must be ID-tagged
- README or section descriptions for each file/module

---

## 17. Success Metrics
- Time played per session
- Animals traced
- Mode completion rate
- (Stored locally only)

---

## 18. Known Exclusions
- No online profiles
- No leaderboards
- No external analytics in MVP
