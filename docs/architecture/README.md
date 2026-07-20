# Architecture Overview

This section documents how the Restaurant POS platform is structured. It is intentionally high-level — concrete designs land alongside each service as it is built.

## Documents

- [High-level architecture](high-level-architecture.md) — services, gateway, shared infrastructure, request flow.
- [Multi-tenant design](multi-tenancy.md) — tenant/branch isolation, configuration, subscription plans.
- [Technology stack](tech-stack.md) — the chosen stack and the rationale.
- [Security](security.md) — authentication, RBAC, auditing, data protection.
- [Integrations](integrations.md) — payment gateways, messaging, hardware, delivery APIs.

## Guiding architectural decisions

1. **Clean Architecture per service.** Each backend service separates Domain, Application (CQRS via MediatR), Infrastructure, and API layers so business rules stay independent of frameworks.
2. **Service-oriented, event-aware.** Services communicate synchronously through the API gateway for queries/commands and asynchronously through RabbitMQ for domain events (e.g. `OrderPlaced`, `PaymentSettled`, `StockDepleted`).
3. **Multi-tenancy is a first-class concern**, not an afterthought — every data access path is tenant-scoped. See [multi-tenancy.md](multi-tenancy.md).
4. **Real-time where it matters.** SignalR powers live table status, the Kitchen Display System, and order timelines.
5. **Offline-capable POS.** The POS client is designed to keep operating without connectivity and reconcile on reconnect; the server treats POS writes as idempotent, client-generated operations.
6. **AI-ready data capture.** Operational events are persisted cleanly so analytics and ML features can be added without re-instrumenting the core.

## Delivery phases

Architecture is realised incrementally — see the [roadmap](../roadmap.md). Phase 1 stands up Identity, Menu, Tables, Orders, POS, and Billing as the operational core.
