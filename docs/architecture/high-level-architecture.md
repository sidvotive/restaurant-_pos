# High-Level Architecture

## Component view

```
                         ┌─────────────────────────────┐
                         │        Client Apps           │
                         │  Web (React) · Mobile (RN)   │
                         │  POS · KDS · Admin · Kiosk   │
                         └──────────────┬──────────────┘
                                        │  HTTPS / WebSocket
                         ┌──────────────▼──────────────┐
                         │        API Gateway           │
                         │  routing · auth · rate limit │
                         └──────────────┬──────────────┘
                                        │
        ┌───────────────┬───────────────┼───────────────┬───────────────┐
        ▼               ▼               ▼               ▼               ▼
   ┌─────────┐    ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌──────────┐
   │Identity │    │  Menu   │     │  POS    │     │ Orders  │     │ Payments │
   └─────────┘    └─────────┘     └─────────┘     └─────────┘     └──────────┘
        ▼               ▼               ▼               ▼               ▼
   ┌─────────┐    ┌─────────┐     ┌─────────┐     ┌──────────────┐
   │Inventory│    │  CRM    │     │ Reports │     │ Notifications │
   └─────────┘    └─────────┘     └─────────┘     └──────────────┘
        │               │               │               │
        └───────────────┴───────────────┴───────────────┘
                                        │
                         ┌──────────────▼──────────────┐
                         │     Shared Infrastructure    │
                         │  PostgreSQL · Redis          │
                         │  RabbitMQ · Object Storage   │
                         └─────────────────────────────┘
```

## Services

| Service        | Responsibility |
|----------------|----------------|
| **Identity**   | Tenants, companies, brands, branches, users, roles, authentication, RBAC. |
| **Menu**       | Categories, products, combos, variants, add-ons, recipes, ingredients, images. |
| **POS**        | Billing sessions, split/merge/hold/resume, discounts, coupons, tips. |
| **Orders**     | Order lifecycle across dine-in/takeaway/delivery; feeds KDS. |
| **Payments**   | Payment capture and settlement across QR/UPI/wallet/card/cash; gateway integration. |
| **Inventory**  | Raw materials, purchases, transfers, wastage, production, audits, low-stock alerts. |
| **CRM**        | Customers, loyalty, memberships, coupons, offers. |
| **Reports**    | Sales, item/category, tax, inventory, cash flow, performance, analytics. |
| **Notifications** | SMS, WhatsApp, Email; real-time push via SignalR. |

> **Note on granularity.** The blueprint targets microservices. Early phases may implement several of these as modules within a smaller number of deployable services (a "modular monolith" that can be split later along the boundaries above) to reduce operational overhead while the product finds its shape. The boundaries here are the contract; the deployment topology can evolve.

## Communication

- **Synchronous** — clients call the API Gateway, which routes to services. Used for commands and queries.
- **Asynchronous** — services publish domain events to **RabbitMQ**; interested services subscribe. Examples: `OrderPlaced` → Inventory (deduct stock), KDS (display); `PaymentSettled` → Reports, CRM (loyalty accrual).
- **Real-time** — **SignalR** hubs push live updates to clients: table status, KDS tickets, order timeline, ready notifications.

## Request flow example — placing a dine-in order

1. Waiter (mobile) creates an order → **Orders** service via gateway.
2. Orders persists the order and publishes `OrderPlaced`.
3. **KDS** receives the event and pushes the ticket to kitchen screens over SignalR.
4. Kitchen updates preparation status → SignalR notifies the waiter and updates the order timeline.
5. On settlement, **POS/Payments** record the bill; `PaymentSettled` fans out to **Reports**, **Inventory**, and **CRM**.

## Shared infrastructure

- **PostgreSQL** — primary transactional store (per-service schemas/databases; see [multi-tenancy.md](multi-tenancy.md)).
- **Redis** — caching, session/token support, real-time fan-out backplane.
- **RabbitMQ** — event bus for asynchronous, decoupled communication.
- **Object storage (S3-compatible)** — menu images, receipts, exports, backups.
