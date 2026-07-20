using Identity.Domain.Common;

namespace Identity.Domain.Tenants;

/// <summary>
/// A SaaS customer. Root of the multi-tenant hierarchy
/// (Tenant → Company → Brand → Branch). Every tenant-owned entity is scoped by TenantId.
/// </summary>
public sealed class Tenant : Entity
{
    public string Name { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; } = DateTimeOffset.UtcNow;

    // Parameterless ctor for EF Core materialisation.
    private Tenant() => Name = string.Empty;

    public Tenant(string name) => Name = name;

    public void Rename(string name) => Name = name;
}
