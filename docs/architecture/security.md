# Security

Security is a cross-cutting concern enforced at the gateway and within every service. This document states the target posture; concrete controls are implemented alongside the Identity service and the API gateway in Phase 1.

## Authentication

- **JWT access tokens** carry the authenticated principal plus tenant, branch, and role/permission claims. Short-lived.
- **Refresh tokens** are rotated on use and revocable; theft of a single refresh token is contained by rotation + revocation lists (stored in Redis/DB).
- **OAuth** for third-party/social sign-in where applicable.
- Tokens are validated at the **API gateway**; downstream services trust the validated, tenant-scoped principal.

## Authorization (RBAC)

- Role-Based Access Control with per-tenant, per-branch scoping (see [../product/personas.md](../product/personas.md)).
- Permissions are expressed as `module.entity.action` and checked in the application layer of each service.
- Subscription/feature entitlements are resolved centrally so services can enforce plan limits without duplicating logic.

## Multi-tenant safety

- Every data path is tenant-scoped; no query runs without a resolved tenant context (see [multi-tenancy.md](multi-tenancy.md)).
- Tenant context is derived from the token, never from client-supplied request bodies.

## Auditing

- **Audit logs** for security- and money-sensitive actions: logins, permission changes, bill voids/discounts, refunds, stock adjustments, price changes, and configuration changes.
- Audit records are append-only and carry actor, tenant/branch, action, before/after where relevant, and timestamp.

## Data protection

- **Encryption in transit** — TLS everywhere (terminated at Nginx/ingress).
- **Encryption at rest** — database and object storage encryption.
- **Secrets** — never committed; injected via environment/secret stores. `.env` files are git-ignored (`.env.example` documents required keys).

## Abuse & availability

- **Rate limiting** at the gateway per principal/tenant/IP.
- Input validation and output encoding to mitigate injection/XSS.
- **Backup & disaster recovery** — regular automated backups of PostgreSQL and object storage, with tested restore procedures and defined RPO/RTO targets.

## Checklist (living)

- [ ] JWT + refresh token rotation implemented
- [ ] Central RBAC permission catalogue defined
- [ ] Tenant-scoping enforced at data-access layer
- [ ] Audit logging on sensitive actions
- [ ] TLS + at-rest encryption configured
- [ ] Secrets managed outside source control
- [ ] Rate limiting at gateway
- [ ] Backup & restore runbook validated
