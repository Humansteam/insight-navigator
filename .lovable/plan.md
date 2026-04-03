

# Plan: Login/Registration Page in Lovable Split-Screen Style

## Goal
Create a `/login` page with a two-panel split layout inspired by Lovable's login page (screenshot 3). Left panel has the auth form with "Strata" branding and tagline "See What Others Miss". Right panel shows an interactive chat-style input prompt area with a gradient/cosmic background.

## Layout

```text
┌──────────────────────────┬──────────────────────────┐
│                          │                          │
│   [Strata Logo]          │                          │
│                          │     (gradient/cosmic     │
│   Log in                 │      background)         │
│   See What Others Miss   │                          │
│                          │                          │
│   [Continue with Google] │   ┌──────────────────┐   │
│   [Continue with GitHub] │   │ Ask Strata to     │   │
│                          │   │ analyze your docs │⬆│ │
│   ─── OR ───             │   └──────────────────┘   │
│                          │                          │
│   Email: [___________]   │                          │
│   Password: [________]   │                          │
│                          │                          │
│   [    Log in    ]       │                          │
│                          │                          │
│   Don't have an account? │                          │
│   Create your account    │                          │
│                          │                          │
└──────────────────────────┴──────────────────────────┘
```

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/pages/Login.tsx` | Create - split-screen login page |
| `src/App.tsx` | Add `/login` route |

## Technical Details

- **Left panel**: White/light background, max-w-md form centered vertically. Logo "S" + "Strata" at top. "Log in" heading. "See What Others Miss" subtitle in muted text. Google/GitHub OAuth buttons (outlined). Divider "OR". Email + Password inputs. Primary "Log in" button. "Create your account" link at bottom.

- **Right panel**: Dark gradient background (deep navy to purple/pink, similar to Lovable's style but with the cosmic/space theme from the Strata brand). A floating chat input bar centered in the lower portion: rounded-full container with placeholder text "Ask Strata to analyze your documents..." and a circular send button. Subtle animated gradient or particle effect for visual appeal.

- **Responsive**: On mobile (<768px), hide right panel, show only the form full-width.

- **No real auth**: Mock form only, buttons log to console. This is a UI demo.

- **Styling**: Uses existing theme CSS variables. Right panel uses custom gradient matching the deep-space theme colors (dark blues, cyans, subtle purples).

