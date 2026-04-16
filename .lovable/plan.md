

# Add "Ledger" Light Theme to Admin Panel

## What Changes

Replace the current dark-glass admin styling with a new light, clean aesthetic inspired by the Ledgerix reference. The admin will have two visual modes accessible via the theme switcher.

**This plan adds a "Ledger" theme option** that transforms the Admin panel into a light, airy interface with crisp white cards on a soft gray background, black typography, and mint-green (#75FB90) accents.

## Visual Direction

From the reference:
- **Background**: Light warm gray `#F0EFF2`
- **Cards/surfaces**: Pure white `#FFFFFF` with subtle `#D3D2D4` borders
- **Text**: Solid black `#000000` for headings, dark gray for secondary
- **Accent**: Mint green `#75FB90` for active states, buttons, highlights
- **Font**: Urbanist (already loaded)
- **Feel**: Clean, editorial, high-clarity, no shadows or glass effects

## Technical Plan

### 1. New CSS theme class in `src/index.css`

Add `.ledger` theme with HSL tokens mapped to the 5-color palette:
- `--background`: #F0EFF2
- `--card`: #FFFFFF
- `--foreground`: #000000
- `--border`: #D3D2D4
- `--primary`: #75FB90
- `--font-sans`: Urbanist

### 2. Register theme in `src/App.tsx`

Add `'ledger'` to `ThemeProvider` themes array.

### 3. Add to `src/components/ThemeSwitcher.tsx`

New dropdown item with a leaf/circle icon for "Ledger".

### 4. Adapt `src/pages/Admin.tsx`

The Admin page currently hardcodes dark-glass styles. Two approaches needed:
- Detect if current theme is `ledger` and swap the design tokens (`glass`, `text`, badge color maps) to light variants
- **Light tokens**: white cards with `#D3D2D4` borders, black text, mint-green accents for active sidebar items and badges
- **Badge colors**: Same semantic meaning but light-friendly — e.g., `bg-emerald-50 text-emerald-700 border-emerald-200` instead of dark translucent versions
- Sidebar: white/light surface, active item gets mint-green left accent
- KPI cards: white bg, black numbers, subtle border
- Tables: white container, light gray header row, clean dividers

### Files Modified
- `src/index.css` — new `.ledger` theme variables
- `src/App.tsx` — register ledger theme
- `src/components/ThemeSwitcher.tsx` — add Ledger option
- `src/pages/Admin.tsx` — conditional light/dark token system based on active theme

