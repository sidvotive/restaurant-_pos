# Infrastructure

Deployment, local development, and observability configuration.

> **Status:** placeholder. Phase 0 adds a local `docker-compose` stack and a CI skeleton — see [`../docs/roadmap.md`](../docs/roadmap.md).

## Intended contents

```
infra/
├── docker/               ← Dockerfiles and docker-compose for local dev
│   └── docker-compose.yml   (PostgreSQL, Redis, RabbitMQ, object storage)
├── k8s/                  ← Kubernetes manifests / Helm charts
├── nginx/                ← ingress / reverse-proxy config
├── ci/                   ← reusable CI workflow pieces
└── observability/        ← Prometheus, Grafana dashboards, OpenTelemetry config
```

## Local development stack (target)

A `docker-compose` file will bring up the shared infrastructure so services can run against real dependencies:

- **PostgreSQL** — primary database
- **Redis** — cache / SignalR backplane
- **RabbitMQ** — event bus (with management UI)
- **S3-compatible storage** (e.g. MinIO) — object storage

## Deployment (target)

- **Docker** images per service and client.
- **Kubernetes** for orchestration and scaling.
- **Nginx** for ingress and TLS termination.
- **GitHub Actions** for CI/CD (build, test, image publish, deploy).

## Observability (target)

- **OpenTelemetry** SDK in every service → traces/metrics/logs.
- **Prometheus** scrapes metrics.
- **Grafana** dashboards and alerting.

## Getting started (once configs land)

Concrete `docker compose up` and deployment commands will be documented here.
