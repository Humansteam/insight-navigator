

# Plan: Signal Redesign — Apple/Ive Philosophy

## Design Principles (Ive approach)
- Radical reduction: remove all labels like "УРОВЕНЬ 1", "УРОВЕНЬ 2" — content speaks for itself
- One idea per screen, maximum whitespace
- Typography as the primary UI element — no emoji, no icons where text works
- Subtle material hints (thin borders, gentle blurs) instead of colored backgrounds
- Animation = physics, not decoration

## Structure (4 screens, scroll-snap)

```text
┌─────────────────────────────────┐
│  Screen 1: THE SIGNAL           │
│                                 │
│  "Open-source как оружие"       │  ← Large, confident typography
│  Meta строит закрытую...        │
│                                 │
│  ┌─ Trending ──────────────┐    │
│  │ 🔥 В тренде · 87%      │    │  ← "В тренде" label + pulsing dot
│  │ обсуждения растут       │    │     NOT "температура" — human language
│  └─────────────────────────┘    │
│                                 │
│  ┌─ Источники ─────────────┐    │
│  │  ▓▓▓▓▓▓▓▓░░░░  27/30   │    │  ← Visual "compression bar"
│  │  Reuters · Axios · FT   │    │     Shows 27 articles → 1 signal
│  │  +24 источника          │    │
│  └─────────────────────────┘    │
│                                 │
│  • Bullet 1 (key fact)          │
│  • Bullet 2                     │
│  • Bullet 3                     │
│                                 │
│  ┌─ Audio ─────────────────┐    │
│  │  ▶  |||||||||||  1:50   │    │
│  │     Послушать анализ    │    │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  Screen 2: SYNTHESIS            │
│                                 │
│  Interactive transcript         │
│  (scrollable, speaker-linked)   │
│  + Meaning map below            │
│  All one continuous block       │
│  Audio controls sticky at top   │
│                                 │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  Screen 3: RABBIT HOLE          │
│                                 │
│  Provocative question           │
│  + Save to brain                │
│  + Next signal teaser           │
│                                 │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  Input bar (fixed bottom)       │
│                                 │
│  [Tech] [Econ] [Geo] [Ethics]   │  ← Lens tags as PINS above input
│  ┌─────────────────────┐  [↑]  │
│  │ Задать вопрос...    │       │
│  └─────────────────────┘       │
└─────────────────────────────────┘
```

## Key Changes

### 1. Temperature → "В тренде" with human language
- Replace thermometer emoji + "температура" with a clear label: **"В тренде"** or **"Горячая тема"**
- Add subtext: "обсуждения растут · 3 дня · 4 страны"
- Pulsing dot animation (like Apple's live indicator) instead of gradient bar
- Color shifts from green (mild) → orange (hot) → red (very hot) based on score

### 2. Source compression visualization
- Show a **fill bar**: `▓▓▓▓▓▓▓▓░░░  27 из 30 статей` — visual metaphor for how many sources are compressed into this signal
- Expandable: tap to see all 27 source names in a minimal list
- Each source has a one-line fact attribution (existing logic preserved)

### 3. Lenses → Pins above input bar (fixed bottom)
- Remove Level 2 as separate screen entirely
- Lens tags become **persistent pill buttons** above the input field at the very bottom
- Tapping a lens tag **opens a half-sheet overlay** from bottom (like Apple Maps) with the voice cards for that lens
- When no lens selected, pins sit quietly above input
- This frees up a whole screen and makes lenses accessible from anywhere

### 4. Synthesis — unified audio+transcript+map block
- Screen 2 becomes the unified synthesis:
  - **Sticky mini-player** at top of this screen (play/pause + waveform + time)
  - **Interactive transcript** below — current segment highlighted, speaker names in accent color, tap to seek
  - **Meaning map** below transcript — same node graph but cleaner (no emoji, thin lines, subtle glow on active node)
  - All scrollable together as one continuous reading experience
  - Audio plays through all of it

### 5. Apple design details
- **No emoji** — replace all emoji with minimal SVG or nothing
- **Font sizes**: headline 22px (bold -0.04em tracking), body 12px, mono labels 8px
- **Colors**: monochrome with ONE accent per screen (purple for signal, blue for synthesis, gold for question)
- **Borders**: 0.5px instead of 1px, `rgba(255,255,255,0.04)` max
- **Corners**: 16px for cards, 24px for sheets
- **Shadows**: `0 2px 20px rgba(0,0,0,0.3)` — soft, diffused
- **Transitions**: spring physics via framer-motion (`type: "spring", damping: 30, stiffness: 300`)

## Files

| File | Action |
|------|--------|
| `src/pages/Signal.tsx` | **Rewrite** — new 3-screen + lens overlay structure |

## Technical Details

### Lens overlay (half-sheet)
- `position: absolute; bottom: input-bar-height; left: 0; right: 0`
- `AnimatePresence` + `motion.div` with `y: "100%"` → `y: 0` spring animation
- Max height 60% of phone frame
- Drag-to-dismiss via `drag="y"` with `dragConstraints`
- Backdrop: subtle blur overlay on drum content

### Source compression bar
- Simple div with `width: ${(27/30)*100}%` fill
- Tap toggles expanded state showing all source pills
- Collapsed: show 3 names + "+24"

### Trending indicator
- Pulsing circle (CSS `@keyframes pulse`) in orange/red
- Text: "В тренде · обсуждения растут"
- Score shown as percentage with color coding

