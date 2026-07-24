# Technology Stack

The stack below is the target for the platform. Choices favour a productive, well-supported ecosystem with strong real-time and multi-tenant capabilities.

## Frontend

| Technology     | Purpose |
|----------------|---------|
| **React**      | Web clients (Admin, POS, KDS, dashboards). |
| **React Native** | Mobile apps (waiter/manager on the floor, mobile POS). |
| **TypeScript** | Type safety across web and mobile. |
| **Tailwind CSS** | Utility-first styling for a consistent, original design system. |

## Backend

| Technology       | Purpose |
|------------------|---------|
| **.NET 9 Web API** | Service runtime. |
| **Clean Architecture** | Domain / Application / Infrastructure / API separation per service. |
| **CQRS**         | _Deferred._ Kept as an option; services currently expose plain use-case methods. |
| **MediatR**      | _Deferred._ Not used for now — use cases are injectable services, not command/handler pairs. |
| **SignalR**      | Real-time push (table status, KDS, order timeline, notifications). |

## Data

| Technology     | Purpose |
|----------------|---------|
| **PostgreSQL** | Primary transactional database. |
| **Redis**      | Caching, session/token support, SignalR backplane. |

## Messaging

| Technology  | Purpose |
|-------------|---------|
| **RabbitMQ** | Asynchronous domain-event bus between services. |

## Storage

| Technology              | Purpose |
|-------------------------|---------|
| **S3-compatible storage** | Menu images, receipts, exports, backups. |

## Authentication

| Technology       | Purpose |
|------------------|---------|
| **JWT**          | Stateless access tokens carrying tenant/branch/role claims. |
| **Refresh tokens** | Session continuity with rotation. |
| **OAuth**        | Third-party / social sign-in where applicable. |

## Deployment

| Technology        | Purpose |
|-------------------|---------|
| **Docker**        | Containerised services and clients. |
| **Kubernetes**    | Orchestration and scaling. |
| **Nginx**         | Ingress / reverse proxy / TLS termination. |
| **GitHub Actions** | CI/CD pipelines. |

## Monitoring & observability

| Technology       | Purpose |
|------------------|---------|
| **OpenTelemetry** | Distributed tracing, metrics, and logs instrumentation. |
| **Prometheus**   | Metrics collection. |
| **Grafana**      | Dashboards and alerting. |

## Directory conventions

- Backend services live under [`/backend`](../../backend/README.md), one Clean Architecture solution per service.
- Frontend clients live under [`/frontend`](../../frontend/README.md).
- Infrastructure (Docker/K8s/CI/observability) lives under [`/infra`](../../infra/README.md).
