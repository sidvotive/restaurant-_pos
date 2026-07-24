# Backend

.NET 9 Web API services following **Clean Architecture**, with **SignalR** for real-time features. Use cases are plain injectable services (no MediatR/CQRS for now — kept deliberately simple).

> **Status:** Identity service with a working **auth vertical** (register / login / refresh), laid out in four Clean Architecture projects under `src/Services/Identity/`.
>
> ⚠️ **Not yet build-verified.** This environment has no .NET SDK, so the code below has **not** been compiled or run. The first `dotnet build` (issue #1) may surface package-version or wiring fixes. Braces/namespaces were checked by hand; treat the versions as a starting point.

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
dotnet sln add src/Services/Identity/Identity.Domain/Identity.Domain.csproj \
               src/Services/Identity/Identity.Application/Identity.Application.csproj \
               src/Services/Identity/Identity.Infrastructure/Identity.Infrastructure.csproj \
               src/Services/Identity/Identity.Api/Identity.Api.csproj
dotnet build

# Create the initial migration and apply it:
dotnet tool install --global dotnet-ef      # once
dotnet ef migrations add InitialIdentity \
  --project src/Services/Identity/Identity.Infrastructure \
  --startup-project src/Services/Identity/Identity.Api
dotnet ef database update \
  --project src/Services/Identity/Identity.Infrastructure \
  --startup-project src/Services/Identity/Identity.Api

dotnet run --project src/Services/Identity/Identity.Api
```

> **Before any real use, replace the placeholder `Jwt:Secret`** in `appsettings.json` with a long random value supplied via configuration/secret store (it is dev-only). Once a `.sln` exists, CI builds and tests the backend automatically.

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
