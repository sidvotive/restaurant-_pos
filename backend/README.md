# Backend

.NET 9 Web API services following **Clean Architecture** with **CQRS** (MediatR) and **SignalR** for real-time features.

> **Status:** starter skeleton. A first service — **Identity** — is laid out in four Clean Architecture projects under `src/Services/Identity/` with a minimal running API (`/health`, `/ping` via MediatR). The solution file and first verified `dotnet build` are the immediate next step (this environment has no .NET SDK, so the skeleton has not yet been build-verified). Phase 1 fleshes out Identity, Menu, Orders, POS, and Tables — see [`../docs/roadmap.md`](../docs/roadmap.md).

## Current skeleton (Identity service)

```
backend/
├── Directory.Build.props                       ← net9.0, nullable, implicit usings
└── src/Services/Identity/
    ├── Identity.Domain/        ← Entity base, Tenant entity
    ├── Identity.Application/   ← MediatR wiring, PingQuery (CQRS demo)
    ├── Identity.Infrastructure/← EF Core IdentityDbContext, Npgsql wiring
    └── Identity.Api/           ← Program.cs, /health + /ping, appsettings.json
```

To create the solution and build (requires the .NET 9 SDK):

```bash
cd backend
dotnet new sln -n RestaurantPos
dotnet sln add src/Services/Identity/**/*.csproj
dotnet build
dotnet run --project src/Services/Identity/Identity.Api
```

Once a `.sln` exists, CI builds and tests the backend automatically.

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
