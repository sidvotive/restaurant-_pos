# Frontend

Client applications: **React** (web) and **React Native** (mobile), both in **TypeScript**, styled with **Tailwind CSS**. Mobile-first and, for the POS, offline-capable.

> **Status:** starter skeleton. A single **POS** web app (Vite + React + TypeScript + Tailwind) lives at the root of `frontend/` and builds. The multi-app monorepo split (below) happens as the Admin, KDS, and mobile surfaces are added.

## Current skeleton

```
frontend/
├── package.json          ← Vite + React 18 + TypeScript + Tailwind 3
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js · postcss.config.js
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx           ← placeholder POS landing
    └── index.css         ← Tailwind directives
```

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
