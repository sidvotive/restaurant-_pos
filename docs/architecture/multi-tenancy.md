# Multi-Tenant Design

The platform is a multi-tenant SaaS. A single deployment serves many businesses, each of which may have multiple companies, brands, and branches.

## Tenancy hierarchy

```
Tenant (SaaS customer / owner)
└── Company
    └── Brand
        └── Branch (physical or virtual outlet)
```

- **Tenant isolation** — data belonging to one tenant is never visible to another.
- **Branch isolation** — within a tenant, operational data (orders, tables, stock, shifts) is scoped to a branch; reporting can roll up across branches.

## Isolation strategy

The default strategy is a **shared database with a mandatory `tenant_id` discriminator** on every tenant-owned table, enforced at the data-access layer (query filters that cannot be bypassed) and, where the database supports it, row-level security. This keeps operations simple while the platform scales.

The design keeps the door open to **schema-per-tenant** or **database-per-tenant** for large enterprise customers, because all access already goes through a tenant-resolution layer. The chosen physical strategy can differ per service without changing application code.

**Rules of thumb:**

- Every tenant-owned entity carries `tenant_id` (and `branch_id` where operational).
- The tenant/branch context is resolved once per request from the authenticated principal and flows through the whole call chain.
- No query executes without a resolved tenant scope. This is enforced centrally, not left to individual handlers.

## Configuration per tenant / branch

- **Configurable tax** — tax rates and GST configuration per tenant, overridable per branch/region.
- **Custom branding** — logo, colours, receipt layout, and app theming per brand.
- **Feature flags** — modules and capabilities can be toggled per tenant/plan.
- **Subscription plans** — plans gate feature access, branch counts, and usage limits.

## Subscription & plans

Subscription plans determine:

- Which modules/features are enabled (via feature flags).
- Limits (branches, users, transactions, storage).
- Billing tier.

Plan enforcement is a cross-cutting concern handled at the gateway/Identity layer so downstream services can trust the resolved entitlements.

## Tenant onboarding (target flow)

1. Owner signs up → tenant created with a default company/brand/branch.
2. Owner configures branding, tax, and branches.
3. Owner invites users and assigns roles (see [../product/personas.md](../product/personas.md)).
4. Menu and tables are set up; the branch goes live.
