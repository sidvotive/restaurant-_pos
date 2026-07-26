# Restaurant POS & Management System

A modern, cloud-based Restaurant Management System (Petpooja-inspired, fully original UI/UX) built as a multi-tenant SaaS platform. Modular, mobile-first, offline-capable POS with an AI-ready architecture.

> **Status:** 🏗️ Scaffolding / Phase 0. This repository currently contains the project structure, architecture documentation, and delivery roadmap. Feature implementation begins in Phase 1 (see [`docs/roadmap.md`](docs/roadmap.md)).

---

## What this is

A management platform for restaurants, cafes, QSR, fine dining, food courts, cloud kitchens, bakeries, sweet shops, and multi-chain brands. It covers point of sale, table and floor management, menu and recipe management, kitchen display, inventory, CRM & loyalty, employee management, finance, and reporting — delivered as a modular, multi-tenant service.

For the full product vision and module breakdown, see [`docs/product/`](docs/product/).

## Repository layout

```
restaurant-_pos/
├── README.md              ← you are here
├── docs/                  ← product, architecture, and delivery documentation
│   ├── product/           ← vision, personas, module specifications
│   ├── architecture/      ← system architecture, multi-tenancy, tech stack, security
│   └── roadmap.md         ← phased delivery plan
├── backend/               ← .NET 9 Web API services (Clean Architecture)  — see backend/README.md
├── frontend/              ← React (web) + React Native (mobile) clients    — see frontend/README.md
├── infra/                 ← Docker, Kubernetes, CI/CD, observability        — see infra/README.md
└── .github/               ← issue templates, PR template
```

## Technology at a glance

| Layer            | Choice                                                        |
|------------------|--------------------------------------------------------------|
| Frontend (web)   | React, TypeScript, Tailwind CSS                              |
| Frontend (mobile)| React Native, TypeScript                                     |
| Backend          | .NET 9 Web API, Clean Architecture, CQRS, MediatR, SignalR  |
| Data             | PostgreSQL, Redis                                            |
| Messaging        | RabbitMQ                                                     |
| Storage          | S3-compatible object storage                                |
| Auth             | JWT + refresh tokens, OAuth                                 |
| Delivery         | Docker, Kubernetes, Nginx, GitHub Actions                   |
| Observability    | OpenTelemetry, Prometheus, Grafana                          |

Full rationale in [`docs/architecture/tech-stack.md`](docs/architecture/tech-stack.md).

## Documentation index

- **Product**
  - [Source blueprint (original PRD)](docs/product/blueprint.md)
  - [Vision & target users](docs/product/vision.md)
  - [Personas & roles (RBAC)](docs/product/personas.md)
  - [Module specifications](docs/product/modules.md)
- **Architecture**
  - [Overview](docs/architecture/README.md)
  - [High-level architecture](docs/architecture/high-level-architecture.md)
  - [Multi-tenant design](docs/architecture/multi-tenancy.md)
  - [Technology stack](docs/architecture/tech-stack.md)
  - [Security](docs/architecture/security.md)
  - [Integrations](docs/architecture/integrations.md)
- **Delivery**
  - [Roadmap](docs/roadmap.md)

## Getting started (for contributors)

1. Read [`docs/product/vision.md`](docs/product/vision.md) and [`docs/architecture/README.md`](docs/architecture/README.md).
2. Check [`docs/roadmap.md`](docs/roadmap.md) for the current phase and open work.
3. Pick up an issue (see `.github/ISSUE_TEMPLATE/`).

### Run the full stack (dev)

The frontend talks to the backend **Identity** service for authentication; other
features still run on client-side mock data (migration in progress).

1. **Infrastructure** (PostgreSQL etc.):
   ```bash
   cp .env.example .env
   docker compose -f infra/docker/docker-compose.yml up -d
   ```
2. **Backend** (needs the .NET 9 SDK — see [`backend/README.md`](backend/README.md) for the one-time solution/migration setup):
   ```bash
   dotnet run --project backend/src/Services/Identity/Identity.Api   # http://localhost:5080
   ```
3. **Frontend** (dev server proxies `/api` → `http://localhost:5080`):
   ```bash
   cd frontend && npm install && npm run dev                          # http://localhost:5173
   ```
4. Open http://localhost:5173, **create an account** on the sign-in screen (registers a
   tenant + Owner via the real API), then use the app.

**Frontend without a backend:** set `VITE_USE_MOCK_AUTH=true` (see `frontend/.env.example`)
to use the built-in mock auth (`owner@demo.test` / `password123`).

## License

To be decided. See repository settings.
