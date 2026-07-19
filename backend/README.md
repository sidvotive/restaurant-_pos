# Backend

.NET 9 Web API services following **Clean Architecture** with **CQRS** (MediatR) and **SignalR** for real-time features.

> **Status:** placeholder. No services implemented yet. Phase 1 introduces the first services (Identity, Menu, Orders, POS, Tables) — see [`../docs/roadmap.md`](../docs/roadmap.md).

## Intended structure

Each service is its own solution laid out in Clean Architecture layers:

```
backend/
├── src/
│   └── Services/
│       ├── Identity/
│       │   ├── Identity.Domain/          ← entities, value objects, domain events
│       │   ├── Identity.Application/     ← CQRS commands/queries, handlers (MediatR), DTOs
│       │   ├── Identity.Infrastructure/  ← EF Core, repositories, external adapters
│       │   └── Identity.Api/             ← controllers/minimal APIs, SignalR hubs, DI
│       ├── Menu/
│       ├── Orders/
│       ├── POS/
│       └── ...
├── src/
│   └── BuildingBlocks/                   ← shared kernel: multi-tenancy, messaging, auth, common
└── tests/                                ← unit + integration tests per service
```

## Layer responsibilities

| Layer            | Depends on        | Contains |
|------------------|-------------------|----------|
| **Domain**       | nothing           | Entities, value objects, domain events, business rules. |
| **Application**  | Domain            | CQRS commands/queries and handlers (MediatR), validation, ports (interfaces). |
| **Infrastructure** | Application, Domain | EF Core/PostgreSQL, Redis, RabbitMQ, storage, external adapters. |
| **Api**          | Application, Infrastructure | HTTP endpoints, SignalR hubs, auth, composition root. |

## Cross-cutting building blocks

- **Multi-tenancy** — tenant/branch resolution and enforced query filtering (see [`../docs/architecture/multi-tenancy.md`](../docs/architecture/multi-tenancy.md)).
- **Messaging** — RabbitMQ publish/subscribe for domain events.
- **Auth** — JWT validation, claims → principal, RBAC checks.
- **Observability** — OpenTelemetry instrumentation.

## Getting started (once code lands)

Concrete `dotnet` build/run/test commands will be documented here as the first service is added.
