# Backend

.NET 9 Web API services following **Clean Architecture**, with **SignalR** for real-time features. Use cases are plain injectable services (no MediatR/CQRS for now — kept deliberately simple).

> **Status:** modular-monolith API hosting the **Identity** (auth), **Menu** (tenant-scoped CRUD), and **Orders** (place/advance/cancel + line snapshots) modules. Identity's build was verified locally; the **Menu** and **Orders** modules were added afterward and should be built/migrated locally (this environment has no .NET SDK — braces/namespaces checked by hand, patterns mirror Identity).

## Identity service

```
backend/
├── Directory.Build.props                          ← net9.0, nullable, implicit usings
└── src/Services/Identity/
    ├── Identity.Domain/         ← Entity, Tenant, User (+ UserRole), RefreshToken
    ├── Identity.Application/    ← AuthService (register/login/refresh) + request DTOs,
    │                              ports (IApplicationDbContext, IPasswordHasher,
    │                              IJwtTokenService, IRefreshTokenService), AuthResponse
    ├── Identity.Infrastructure/ ← EF Core IdentityDbContext, PBKDF2 password hashing,
    │                              JWT issuance, SHA-256 refresh-token hashing
    └── Identity.Api/            ← Program.cs, JWT bearer auth, /api/auth endpoints,
                                   ProblemDetails exception middleware, appsettings.json
```

### Auth endpoints

| Method + path        | Body                                          | Returns |
|----------------------|-----------------------------------------------|---------|
| `POST /api/auth/register` | `tenantName, email, password, fullName`   | `AuthResponse` (access + refresh token) |
| `POST /api/auth/login`    | `email, password`                         | `AuthResponse` |
| `POST /api/auth/refresh`  | `refreshToken`                            | `AuthResponse` (rotated tokens) |

- Passwords are hashed with ASP.NET Core's PBKDF2 `PasswordHasher`.
- Access tokens are signed JWTs carrying `sub`, `email`, `tenant_id`, and role claims.
- Refresh tokens are random 256-bit values; only their SHA-256 hash is stored, and refresh **rotates** (old token revoked and linked to its replacement).
- `Register` creates a tenant plus its initial **Owner** user.

> Fine-grained RBAC (permission catalogue), branches, and user invitations are the remaining parts of issue #2.

### Build & run (requires the .NET 9 SDK + a running PostgreSQL — see `infra/`)

```bash
cd backend
dotnet new sln -n RestaurantPos
dotnet sln add src/Services/Identity/**/*.csproj \
               src/Services/Menu/**/*.csproj \
               src/Services/Orders/**/*.csproj
dotnet build

# EF tooling (once):
dotnet tool install --global dotnet-ef

# Migrations — one per DbContext (the host runs both modules, so --context is required):
STARTUP=src/Services/Identity/Identity.Api
dotnet ef migrations add InitialIdentity --context IdentityDbContext \
  --project src/Services/Identity/Identity.Infrastructure --startup-project $STARTUP
dotnet ef migrations add InitialMenu --context MenuDbContext \
  --project src/Services/Menu/Menu.Infrastructure --startup-project $STARTUP
dotnet ef migrations add InitialOrders --context OrdersDbContext \
  --project src/Services/Orders/Orders.Infrastructure --startup-project $STARTUP
dotnet ef database update --context IdentityDbContext \
  --project src/Services/Identity/Identity.Infrastructure --startup-project $STARTUP
dotnet ef database update --context MenuDbContext \
  --project src/Services/Menu/Menu.Infrastructure --startup-project $STARTUP
dotnet ef database update --context OrdersDbContext \
  --project src/Services/Orders/Orders.Infrastructure --startup-project $STARTUP

dotnet run --project src/Services/Identity/Identity.Api   # http://localhost:5080
```

> **Modular monolith:** `Identity.Api` is the single host process; it composes the **Identity**, **Menu**, and **Orders** modules (own layers, own `DbContext`, same PostgreSQL database). Each module can later be split into its own service along these boundaries.
>
> **Before any real use, replace the placeholder `Jwt:Secret`** in `appsettings.json` with a long random value supplied via configuration/secret store (it is dev-only). Once a `.sln` exists, CI builds and tests the backend automatically.

### Menu module

Tenant-scoped CRUD, hosted at `/api/menu` (all endpoints require auth; the tenant is read from the JWT `tenant_id` claim):

| Method + path | Purpose |
|---|---|
| `GET /api/menu/` | The tenant's categories + products |
| `POST /api/menu/categories` · `PUT /…/{id}` · `DELETE /…/{id}` | Category CRUD (delete cascades products) |
| `POST /api/menu/products` · `PUT /…/{id}` · `DELETE /…/{id}` | Product CRUD |

### Orders module

Tenant-scoped, hosted at `/api/orders` (auth required; tenant from the JWT). Orders store their line snapshots and the full bill breakdown (subtotal/discount/tax/tip/total):

| Method + path | Purpose |
|---|---|
| `GET /api/orders/` | The tenant's orders (newest first) |
| `POST /api/orders/` | Place an order (server assigns the number) |
| `POST /api/orders/{id}/advance` | placed → preparing → ready → served |
| `POST /api/orders/{id}/cancel` | Cancel an order |
| `DELETE /api/orders/` | Clear the tenant's orders |

## Intended structure

Each service is its own solution laid out in Clean Architecture layers:

```
backend/
├── src/
│   └── Services/
│       ├── Identity/
│       │   ├── Identity.Domain/          ← entities, value objects, domain events
│       │   ├── Identity.Application/     ← use-case services, DTOs, ports
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
| **Application**  | Domain            | Use-case services (e.g. `AuthService`), request/response DTOs, validation, ports (interfaces). |
| **Infrastructure** | Application, Domain | EF Core/PostgreSQL, Redis, RabbitMQ, storage, external adapters. |
| **Api**          | Application, Infrastructure | HTTP endpoints, SignalR hubs, auth, composition root. |

## Cross-cutting building blocks

- **Multi-tenancy** — tenant/branch resolution and enforced query filtering (see [`../docs/architecture/multi-tenancy.md`](../docs/architecture/multi-tenancy.md)).
- **Messaging** — RabbitMQ publish/subscribe for domain events.
- **Auth** — JWT validation, claims → principal, RBAC checks.
- **Observability** — OpenTelemetry instrumentation.

## Getting started (once code lands)

Concrete `dotnet` build/run/test commands will be documented here as the first service is added.
