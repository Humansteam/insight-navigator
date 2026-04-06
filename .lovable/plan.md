

# Plan: AI Onboarding Chat for Strata

## Goal
Create an interactive 3-step onboarding flow at `/onboarding` styled as a conversational AI chat. The user "talks" with Strata to set up their profile. Based on the uploaded OnboardingChat.tsx reference but adapted to use the project's design system (Tailwind CSS variables, framer-motion, shadcn/ui components).

## Flow

```text
┌──────────────────────────────────────────────────┐
│         [gradient orb]                           │
│       Welcome to Strata                          │
│   Your personal analyst. Let's set things up.    │
│                                                  │
│  ┌─────────────────────────────────────────────┐ │
│  │ AI: Hi! I'm your Strata analyst...         │ │
│  │ Let's start — what do you do?              │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  Step 1: [textarea] + [Continue]                 │
│                                                  │
│  ── after submit ──                              │
│                                                  │
│           [user bubble: "Building AI product..."]│
│                                                  │
│  ┌─────────────────────────────────────────────┐ │
│  │ AI: Which topics matter to you?            │ │
│  │ [graph hint: "KB suggests 3 related areas"]│ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  Step 2: [topic chips] + [custom input]          │
│          + [Continue (N selected)]               │
│                                                  │
│  ── after submit ──                              │
│                                                  │
│  ┌─────────────────────────────────────────────┐ │
│  │ AI: Whose thinking do you trust?           │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  Step 3: [authority chips] + [Complete setup]    │
│          + [Skip this step]                      │
│                                                  │
│  ── after submit ──                              │
│                                                  │
│  ┌─────────────────────────────────────────────┐ │
│  │ AI: All set. Here's your profile:          │ │
│  │ [Summary Card: You]                        │ │
│  │ [Summary Card: Tracking]                   │ │
│  │ [Summary Card: Voices]                     │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  [Go to your feed →]                             │
└──────────────────────────────────────────────────┘
```

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/pages/Onboarding.tsx` | Create -- main onboarding page |
| `src/App.tsx` | Add `/onboarding` route |

## Technical Details

### Page: `src/pages/Onboarding.tsx`

- **Layout**: Full-screen centered, single column `max-w-lg`, dark theme forced (matches screenshots). Header with gradient orb (reuse from Login), "Welcome to Strata" title, subtitle.

- **Chat engine**: Local state machine with `step` (0-4), `messages[]` array, typing indicator with animated dots. Messages render as left-aligned AI bubbles (bg-card border) and right-aligned user bubbles (bg-primary). Adapted from uploaded `OnboardingChat.tsx` logic but using project's `cn()`, `Button`, `Input`, `Textarea` components and CSS variables.

- **Step 1 -- Context**: Textarea with placeholder "Example: Building an AI product for analysts...". Continue button. On submit: add user message, simulate typing, show Step 2.

- **Step 2 -- Topics**: 16 topic chips with emojis (AI/ML, RAG, Startups, etc.). Graph-suggested chips appear as dashed-border variants based on Step 1 text analysis (mock logic). Custom topic input field. "Select at least 2" validation. On submit: add user message with selected topics, simulate typing, show Step 3.

- **Step 3 -- Authorities**: 12 expert chips (Karpathy, Paul Graham, Huberman, etc.) with domain labels. Graph-suggested authorities based on selected topics. "Complete setup" + "Skip this step" buttons. On submit: show summary.

- **Summary**: Three `SummaryCard` components (You, Tracking, Voices) inside the final AI message. "Go to your feed" CTA button navigates to `/`.

- **Animations**: framer-motion for message appearance (fade + slide up), typing indicator with CSS keyframe blink, smooth scroll to bottom on new messages.

- **Styling**: Uses project CSS variables (`--background`, `--primary`, `--border`, etc.). Chip selected state uses primary color. Dark background via `bg-background` in deep-space or dark theme. Responsive -- works on mobile (single column, full width).

### Route: `src/App.tsx`
- Add `<Route path="/onboarding" element={<Onboarding />} />`.

### Differences from uploaded reference
- Uses shadcn `Button`, `Textarea` instead of raw HTML elements
- Uses `cn()` utility for conditional classes
- Uses project's CSS variable colors instead of hardcoded zinc/purple
- Adds framer-motion animations (not just CSS)
- Gradient orb header matches Login page style
- Navigate to `/` on completion instead of alert

