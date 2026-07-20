# Frontend

Client applications: **React** (web) and **React Native** (mobile), both in **TypeScript**, styled with **Tailwind CSS**. Mobile-first and, for the POS, offline-capable.

> **Status:** working POS + Orders + KDS shell (issues #10, #6, #8). A single web app (Vite + React + TypeScript + Tailwind + React Router) lives at the root of `frontend/`. It runs the **Phase-1 core loop client-side on mock persistence**: build a bill in the **POS**, **Send to Kitchen**, watch the ticket appear on the **Kitchen Display**, advance it (placed → preparing → ready → served), and see it reflected on the **Orders** page. Orders are **persisted to `localStorage`**, so they survive a refresh (an early step toward the real offline-capable POS). Real data lands with the backend (Menu #4, Orders #6, POS/Billing #7). Verified: `npm run build`, `npm test` (Vitest), and headless-Chromium smoke tests of the loop and of persistence-across-reload all pass.

## Current structure

```
frontend/
├── package.json          ← Vite + React 18 + TS + Tailwind 3 + React Router 7
├── vite.config.ts · tsconfig.json · tailwind.config.js · postcss.config.js
├── index.html
└── src/
    ├── main.tsx · App.tsx          ← entry + router + OrdersProvider
    ├── components/AppShell.tsx      ← sidebar nav + layout
    ├── routes/                      ← PosPage, OrdersPage, KdsPage, PlaceholderPage
    ├── features/
    │   ├── menu/mockMenu.ts         ← placeholder menu data (→ Menu service #4)
    │   ├── cart/                    ← CartContext (reducer) + totals
    │   ├── orders/                  ← OrdersStore (reducer) + status metadata
    │   └── pos/                     ← MenuGrid, CartPanel
    ├── lib/
    │   ├── api/client.ts            ← PosApi interface + mock impl (→ real HTTP client)
    │   ├── money.ts                 ← integer minor-unit money formatting
    │   └── persist.ts               ← safe localStorage load/save helpers
    └── types/domain.ts             ← shared domain types
```

**Money is handled in integer minor units** (paise/cents) throughout to avoid floating-point rounding; formatting to a currency string happens only at display time.

Commands:

```bash
cd frontend
npm install     # or: npm ci  (uses package-lock.json)
npm run dev     # start the dev server
npm run build   # type-check + production build
npm test        # run the unit test suite (Vitest)
```

## Tests

Unit tests (Vitest) cover the pure logic where correctness matters most — the
money math and cart state:

- `src/features/cart/cartTotals.test.ts` — subtotal/tax/total, integer rounding
- `src/features/cart/cartReducer.test.ts` — add/increment/decrement/remove/clear, immutability
- `src/features/orders/ordersReducer.test.ts` — place, status progression, advance targeting, clear
- `src/lib/persist.test.ts` — save/load round-trip, fallbacks, storage-unavailable no-op
- `src/lib/money.test.ts` — currency formatting

Run with `npm test` (CI runs it automatically on frontend changes).

## Intended structure (as more surfaces are added)

```
frontend/
├── apps/
│   ├── pos/          ← React web POS (tablet-first, offline-capable)
│   ├── admin/        ← React web admin & dashboards
│   ├── kds/          ← React web Kitchen Display System
│   └── mobile/       ← React Native app (waiter/manager on the floor)
├── packages/
│   ├── ui/           ← shared design system (Tailwind-based components)
│   ├── api-client/   ← typed client for the backend API
│   └── shared/       ← shared types, utils, hooks
```

> The current single-app layout is promoted into this monorepo structure when the second surface (Admin or KDS) is added.

## Surfaces

| App     | Primary users            | Notes |
|---------|--------------------------|-------|
| **POS** | Cashier, Waiter          | Fast billing, tablet-first, must work offline and reconcile on reconnect. |
| **Admin** | Owner, Admin, Manager, Accountant | Configuration, menu, reports, finance, dashboards. |
| **KDS** | Kitchen Staff            | Live ticket board, prep/ready status (real-time via SignalR). |
| **Mobile** | Waiter, Manager        | Order-taking and oversight on the floor. |

## Design direction

Original UI/UX. Candidate themes (Dark + Gold premium, Glassmorphism, Material 3, animated order timeline, live kitchen board) are explored in design — see [`../docs/product/vision.md`](../docs/product/vision.md).

## Getting started (once code lands)

Concrete install/dev/build commands will be documented here as the first app is added.
