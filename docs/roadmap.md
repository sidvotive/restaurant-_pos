# Delivery Roadmap

A phased plan for building the platform. Phases are ordered so that each one delivers something operable and de-risks the next. This document is the single source of truth for "what's next" and should be updated as work lands.

> **Current phase:** Phase 0 — Foundations (scaffolding & documentation).

---

## Phase 0 — Foundations *(current)*

Set up the ground the product is built on.

- [x] Repository scaffold (structure, `.gitignore`, `.editorconfig`)
- [x] Product documentation (vision, personas, modules)
- [x] Architecture documentation (high-level, multi-tenancy, tech stack, security, integrations)
- [x] Delivery roadmap
- [x] GitHub issue & PR templates
- [x] CI pipeline skeleton (change-filtered backend/frontend build/lint/test, guarded until code exists)
- [x] Local dev environment (`docker-compose` for PostgreSQL, Redis, RabbitMQ, MinIO)
- [x] Frontend app skeleton (Vite + React + TypeScript + Tailwind) — builds
- [~] Backend solution skeleton (Identity Clean Architecture projects in place; `.sln` + first verified build pending — needs .NET 9 SDK)

## Phase 1 — Operational Core

The minimum system that can run a restaurant floor. Maps to the blueprint's Phase 1.

- [ ] **Authentication & Identity** — tenants, branches, users, roles (RBAC), JWT + refresh tokens
- [ ] **Menu** — categories, products, variants, add-ons, images
- [ ] **Tables** — floor designer, live table status, transfer/merge
- [ ] **Orders** — dine-in / takeaway / delivery order lifecycle
- [ ] **POS / Billing** — fast billing, split/merge/hold/resume, discounts, coupons, tips, payment modes
- [ ] **Kitchen Display System** — live tickets, prep/ready status (SignalR)
- [ ] Real-time backbone (SignalR + Redis backplane)
- [ ] Multi-tenant enforcement at the data-access layer

**Exit criteria:** a single branch can be configured, take dine-in/takeaway orders, drive the kitchen, and settle bills.

## Phase 2 — Back-of-house & Growth

Maps to the blueprint's Phase 2.

- [ ] **Inventory** — raw materials, purchase, transfer, wastage, production, audit, low-stock alerts
- [ ] **CRM** — customer database, loyalty points, membership, coupons, birthday offers
- [ ] **Messaging** — SMS / WhatsApp / Email (Notifications service)
- [ ] **Reports** — sales, item/category, tax, inventory, cash flow, waiter performance, hourly sales, customer analytics
- [ ] **Finance** — expenses, vendor payments, taxes/GST, P&L
- [ ] **Employee Management** — attendance, shift, salary, incentives

**Exit criteria:** a branch is fully operable end-to-end including stock, customers, finance, and reporting.

## Phase 3 — Scale & Intelligence

Maps to the blueprint's Phase 3.

- [ ] **Franchise / multi-chain** — multi-company, multi-brand, franchise support at scale
- [ ] **AI** — sales forecasting, demand prediction, inventory optimisation, smart reorder, chatbot, menu recommendations, customer segmentation
- [ ] **Analytics** — advanced cross-branch analytics
- [ ] **Mobile Apps** — polished React Native apps

## Future enhancements *(backlog)*

- Self-Ordering Kiosk
- QR Menu Ordering
- Voice Ordering
- AI Assistant
- Dynamic Pricing
- Multi-country Tax
- Marketplace Integrations

---

## Tracking on GitHub

Phase 1 is tracked as issues, grouped by **phase labels** (`phase-0`, `phase-1`, …) and tied together by per-phase **epics**:

- **Epic: Phase 1 — Operational Core** (#11) → child issues #1–#10
- **Epic: Phase 2 — Back-of-house & Growth** (#12)
- **Epic: Phase 3 — Scale & Intelligence** (#13)

> Phases are grouped with **labels**, not GitHub Milestones — milestones can't be created through the tooling used here. If you prefer milestones, create them in the GitHub UI (one per phase) and reassign the issues; the labels can then be dropped.

## How to use this roadmap

- Each unchecked item becomes a GitHub issue (use the templates in `.github/ISSUE_TEMPLATE/`); Phase 2/3 items are split out of their epics as those phases approach.
- Update the checkboxes here — and the epic checklists — as work merges so the roadmap reflects reality.
