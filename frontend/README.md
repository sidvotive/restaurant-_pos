# Frontend

Client applications: **React** (web) and **React Native** (mobile), both in **TypeScript**, styled with **Tailwind CSS**. Mobile-first and, for the POS, offline-capable.

> **Status:** authenticated POS + Orders + KDS + Tables + Menu + Reports shell (issues #10, #6, #8, #5, #4, #2). **Reports** aggregates placed orders into KPIs (orders, sales, avg order, items, **tax collected, discounts given**), sales-by-order-type and sales-by-payment-mode breakdowns, and top items. Each order stores its full bill breakdown (subtotal/discount/tax/tip) so these are exact. Each bill is settled with a **payment method** (cash / card / UPI / QR), captured on the order. An optional **customer** (name/phone) can be attached to an order; the **Customers** page derives a CRM list (visits, total spend, and **loyalty points** — 1 per ₹10) from that. **Inventory** tracks per-product stock, draws it down as orders are sent, and flags low/out-of-stock items. **Finance** records expenses and shows net (sales − expenses). **Staff** tracks attendance — clock in/out with hours logged and an on-duty count. The **Menu** admin manages categories/products (CRUD, persisted) and is the source of truth the POS reads from — edits show up live in billing. The app is **gated behind a login** (mock auth mirroring the Identity `/api/auth` contract; sessions persist and expire), then runs the Phase-1 core loop below. The **Tables** floor view feeds table selection into the POS: picking a free table tags the dine-in order and seats the table; free tables can also be **reserved** for a guest. The layout is **responsive** — a sidebar on desktop, a bottom tab bar on mobile, with the POS menu/cart stacking on small screens. A single web app (Vite + React + TypeScript + Tailwind + React Router) lives at the root of `frontend/`. It runs the **Phase-1 core loop client-side on mock persistence**: build a bill in the **POS** (with per-bill **discount and tip** — discount before tax, tip after — **coupon codes** that drive the discount, **split bill** into equal shares, and **hold/resume** to park a bill and pick it up later), **Send to Kitchen**, watch the ticket appear on the **Kitchen Display**, advance it (placed → preparing → ready → served), and see it reflected on the **Orders** page. Orders are **persisted to `localStorage`**, so they survive a refresh (an early step toward the real offline-capable POS). Real data lands with the backend (Menu #4, Orders #6, POS/Billing #7). Verified: `npm run build`, `npm test` (Vitest), and headless-Chromium smoke tests of the loop and of persistence-across-reload all pass.

## Current structure

```
frontend/
├── package.json          ← Vite + React 18 + TS + Tailwind 3 + React Router 7
├── vite.config.ts · tsconfig.json · tailwind.config.js · postcss.config.js
├── index.html
└── src/
    ├── main.tsx · App.tsx          ← entry + router + Auth/Orders providers
    ├── components/                  ← AppShell (nav + sign-out), RequireAuth (route guard)
    ├── routes/                      ← LoginPage, PosPage, OrdersPage, KdsPage, TablesPage, MenuPage, ReportsPage
    ├── features/
    │   ├── auth/                    ← AuthContext (session + persistence), session validity
    │   ├── menu/                    ← MenuStore (reducer, CRUD) + seed data; POS reads this
    │   ├── cart/                    ← CartContext (reducer) + totals
    │   ├── coupons/                 ← coupon catalog + apply logic (drives the discount)
    │   ├── orders/                  ← OrdersStore (reducer) + status metadata
    │   ├── held/                    ← HeldBillsStore (reducer) + held-bills bar (hold/resume)
    │   ├── reports/                 ← sales aggregation (summary, by-type, by-payment, top items)
    │   ├── customers/               ← customer aggregation from orders (CRM) + loyalty
    │   ├── inventory/               ← InventoryStore (reducer) + low-stock helper
    │   ├── finance/                 ← ExpensesStore (reducer) + totals
    │   ├── staff/                    ← StaffStore (attendance reducer) + shift helpers
    │   ├── tables/                  ← TablesStore (reducer) + floor grouping/summary
    │   └── pos/                     ← MenuGrid, CartPanel
    ├── lib/
    │   ├── api/authClient.ts        ← AuthApi (matches Identity #2 contract) + mock impl
    │   ├── money.ts                 ← integer minor-unit money formatting + parsing
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
- `src/features/coupons/coupons.test.ts` — percent/flat coupons, clamp, invalid/empty guards
- `src/features/pos/splitBill.test.ts` — even split, remainder spread, sums to total, guards
- `src/features/cart/cartReducer.test.ts` — add/increment/decrement/remove/clear, immutability
- `src/features/orders/ordersReducer.test.ts` — place, status progression, advance targeting, clear
- `src/features/held/heldBillsReducer.test.ts` — hold ordering, remove, unknown-id no-op
- `src/features/reports/salesReport.test.ts` — sales summary, by-type/by-payment grouping, top-item ranking
- `src/features/customers/customerReport.test.ts` — grouping by phone/name, visits/spend/points, sort order
- `src/features/customers/loyalty.test.ts` — points earned per spend, flooring, zero/negative guards
- `src/features/inventory/inventoryReducer.test.ts` — set/decrement stock, untracked ignored, low-stock filter
- `src/features/finance/expensesReducer.test.ts` — add/remove expenses, total
- `src/features/staff/attendanceReducer.test.ts` — clock in/out, worked-minutes, duration format
- `src/features/tables/tablesReducer.test.ts` — select/status, auto-deselect, reserve/free, area grouping, summary
- `src/features/menu/menuReducer.test.ts` — category/product CRUD, remove-category cascade
- `src/features/auth/session.test.ts` — session validity / expiry
- `src/lib/api/authClient.test.ts` — mock login/register success + rejection paths
- `src/lib/persist.test.ts` — save/load round-trip, fallbacks, storage-unavailable no-op
- `src/lib/money.test.ts` — currency formatting + amount parsing

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
