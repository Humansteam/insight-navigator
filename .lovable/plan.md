

# Plan: Mobile Signal Page — Depth-Scroll News Feed

## Goal
Create `/signal` — a mobile phone mockup centered on screen with a vertical scroll-snap news reader. Three full-screen layers with **opacity-by-distance** effect: the centered layer is fully bright, layers above/below fade out. No buttons, no tabs — just scroll down.

## Core Mechanic

```text
┌─────── Phone 320×640 ──────┐
│  Status bar  9:41           │
│  Nav: ‹ Meta × Open-Source  │
│─────────────────────────────│
│                             │
│  ░░ Layer above (faded) ░░  │
│                             │
│  ████ ACTIVE LAYER ████████ │  ← full opacity, snap-center
│  ████ (one of 3 slides) ███ │
│                             │
│  ░░ Layer below (faded) ░░  │
│                             │
│─────────────────────────────│
│  Input bar: "Ask..."   ↑   │
│  ● ▎ ●  progress dots      │
└─────────────────────────────┘
```

**Opacity engine**: `IntersectionObserver` with `threshold` array (0 to 1 in 20 steps). Each slide's opacity = its intersection ratio. Centered slide → ratio ~1.0 → full brightness. Partially scrolled → ratio 0.3–0.7 → ghosted. Fully off-screen → 0.

## Three Layers

**Layer 1 — News/Thesis** (purple `#7c5cdb`)
- Type label: `НОВОСТЬ · ТЕЗИС`
- Headline with highlighted keyword
- 2-line subtitle
- Body paragraph (AI summary)
- Source row: dots + mono names (Axios, Reuters, The Verge +4)
- Scroll hint: `↓ мнения авторов` with bobbing arrow

**Layer 2 — Voices** (blue `#5caade`)
- Type label: `ГОЛОСА · ИЗ БАЗЫ ЗНАНИЙ`
- 2 expert voice cards (Peter Thiel, Andrej Karpathy) — avatar initials, name, role, quote, "expand" link
- KB knowledge row — green accent, document count
- Scroll hint: `↓ сдвигающий вопрос`

**Layer 3 — Question** (gold `#c8a050`)
- Type label: `ВОПРОС · ДЛЯ РАЗМЫШЛЕНИЯ`
- Gradient-bordered question card with italic text
- Collision hint card linking to next thread
- Hint: `↑ или задай свой вопрос`

## Files

| File | Action |
|------|--------|
| `src/pages/Signal.tsx` | **Create** — full page component |
| `src/App.tsx` | **Edit** — add `/signal` route |

## Technical Details

### `src/pages/Signal.tsx`
- **Phone frame**: `w-[320px] h-[640px] rounded-[44px]` centered on `#080705` background
- **Drum container**: `overflow-y-auto scroll-snap-type-y-mandatory` with fade overlays (top/bottom gradients via sticky pseudo-divs)
- **Each slide**: `min-h-full snap-center` with flex column, vertically centered content
- **Opacity tracking**: `useEffect` + `IntersectionObserver` on each slide ref, threshold array `[0, 0.05, 0.1, ..., 1.0]`. Store ratios in state, apply `style={{ opacity: ratio }}` per slide. Smooth via CSS `transition: opacity 0.15s`
- **Progress dots**: 3 vertical dots on right side, active dot = elongated purple bar (`h-[14px] rounded-[2px]`), inactive = `w-1 h-1 rounded-full`
- **Input bar**: Fixed bottom, rounded input + circular purple send button
- **Colors**: All hardcoded (self-contained dark theme), no dependency on project CSS vars
- **Fonts**: JetBrains Mono for labels (already in project), Inter for body

### `src/App.tsx`
- Add `import Signal from "./pages/Signal"` and `<Route path="/signal" element={<Signal />} />`

