# Frontend

Client applications: **React** (web) and **React Native** (mobile), both in **TypeScript**, styled with **Tailwind CSS**. Mobile-first and, for the POS, offline-capable.

> **Status:** placeholder. No apps implemented yet. Phase 1 introduces the POS and Admin web surfaces — see [`../docs/roadmap.md`](../docs/roadmap.md).

## Intended structure

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

> The exact tooling (monorepo manager, bundler) is decided when the first app is scaffolded in Phase 0/1.

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
