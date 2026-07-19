# Frontend

Client applications: **React** (web) and **React Native** (mobile), both in **TypeScript**, styled with **Tailwind CSS**. Mobile-first and, for the POS, offline-capable.

> **Status:** working POS shell (issue #10). A single **POS** web app (Vite + React + TypeScript + Tailwind + React Router) lives at the root of `frontend/`. It has an app shell with navigation and a functional **menu → cart → bill** flow running on **mock data** pending the backend (Menu #4, POS/Billing #7). Verified: `npm run build` (type-check + bundle) and a headless-Chromium smoke test of the flow both pass.

## Current structure

```
frontend/
├── package.json          ← Vite + React 18 + TS + Tailwind 3 + React Router 7
├── vite.config.ts · tsconfig.json · tailwind.config.js · postcss.config.js
├── index.html
└── src/
    ├── main.tsx · App.tsx          ← entry + router
    ├── components/AppShell.tsx      ← sidebar nav + layout
    ├── routes/                      ← PosPage, PlaceholderPage
    ├── features/
    │   ├── menu/mockMenu.ts         ← placeholder menu data (→ Menu service #4)
    │   ├── cart/                    ← CartContext (reducer) + totals
    │   └── pos/                     ← MenuGrid, CartPanel
    ├── lib/
    │   ├── api/client.ts            ← PosApi interface + mock impl (→ real HTTP client)
    │   └── money.ts                 ← integer minor-unit money formatting
    └── types/domain.ts             ← shared domain types
```

**Money is handled in integer minor units** (paise/cents) throughout to avoid floating-point rounding; formatting to a currency string happens only at display time.

Commands:

```bash
cd frontend
npm install     # or: npm ci  (uses package-lock.json)
npm run dev     # start the dev server
npm run build   # type-check + production build
```

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
