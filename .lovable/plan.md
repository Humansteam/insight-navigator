

# Apply Ledger Dashboard Style to /admin (Keep Dark-Blue Too)

## What Changes

Add the Ledger-style accounting dashboard (currently at `/admin-ledger`) as the **Dashboard view** inside `/admin` when the Ledger theme is active. When any dark theme is active, the existing dark-blue admin dashboard remains unchanged.

## How It Works

- When theme = `ledger` and view = `dashboard`: render the Ledgerix-style dashboard (income chart, KPI cards with recharts, floating search bar) inside the Admin layout
- When theme = dark/deep-space and view = `dashboard`: render the existing KPI cards dashboard (current behavior)
- All other sections (Sources, Users, Settings, etc.) continue using the existing token-based system for both themes

## Technical Plan

### 1. Extract Ledger Dashboard as a component

Move the chart/KPI content from `AdminLedger.tsx` into a reusable `LedgerDashboard` component (or import it directly).

### 2. Update Admin.tsx DashboardSection

In the `DashboardSection` component, check `isLedger` from the token context:
- If ledger → render the Ledgerix-style dashboard (income chart, sales forecast, monthly expenses, project budget, insight gauge, floating search)
- If dark → render existing 4 KPI cards + feed table

### 3. Keep dark-blue style intact

The existing dark tokens (`glassDark`, `textDark`, navy gradient background) remain exactly as they are. No changes to the dark theme styling.

### Files Modified
- `src/pages/Admin.tsx` — add conditional Ledger dashboard rendering in `DashboardSection`
- `src/pages/AdminLedger.tsx` — extract chart components for reuse (or inline the dashboard content into Admin.tsx)

