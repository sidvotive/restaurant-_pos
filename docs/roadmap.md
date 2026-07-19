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
- [ ] CI pipeline skeleton (build/lint/test placeholders)
- [ ] Local dev environment (`docker-compose` for PostgreSQL, Redis, RabbitMQ)
- [ ] Backend solution skeleton (Clean Architecture template for one service)
- [ ] Frontend app skeleton (React + TypeScript + Tailwind)

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

## How to use this roadmap

- Each unchecked item should become a GitHub issue (use the templates in `.github/ISSUE_TEMPLATE/`).
- Group issues under milestones named after the phases.
- Update the checkboxes here as work merges so the roadmap reflects reality.
