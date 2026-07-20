# Personas & Roles (RBAC)

The platform uses **Role-Based Access Control**. Roles are scoped per tenant and, where relevant, per branch. A single user may hold different roles at different branches.

## Roles

| Role           | Primary responsibility | Representative permissions |
|----------------|------------------------|----------------------------|
| **Owner**      | Business owner across all companies/brands/branches | Everything, including billing/subscription, branding, feature flags, and user administration. |
| **Admin**      | System administration for a tenant | Manage users, menu, tables, integrations, and configuration; view all reports. |
| **Manager**    | Runs a branch day-to-day | Approve discounts/voids, manage shifts, view branch reports, oversee inventory. |
| **Cashier**    | Handles billing and payments | Create/settle bills, apply configured discounts/coupons, take payments, open/close cash drawer. |
| **Waiter**     | Takes and manages orders at tables | Create/modify orders, assign tables, send to kitchen, request bill. |
| **Kitchen Staff** | Prepares orders | View Kitchen Display System, update preparation/ready status. |
| **Accountant** | Finance and compliance | Expenses, vendor payments, taxes/GST, P&L, financial reports (read-heavy). |

## Role scoping

- **Tenant scope** — every role exists within a tenant (company/brand). No cross-tenant access.
- **Branch scope** — operational roles (Manager, Cashier, Waiter, Kitchen Staff) are further constrained to the branches they are assigned to.
- **Owner/Admin** may operate across all branches within their tenant.

## Permission model (target)

Permissions are grouped by module and action (e.g. `pos.bill.void`, `menu.product.edit`, `inventory.stock.adjust`). Roles are permission bundles; custom roles can be composed from the permission catalogue. The concrete catalogue is defined alongside the Identity service in Phase 1.

See [modules.md](modules.md) for the module list that anchors the permission catalogue, and [../architecture/security.md](../architecture/security.md) for how RBAC is enforced.
