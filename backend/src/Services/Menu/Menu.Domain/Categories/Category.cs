using Menu.Domain.Common;

namespace Menu.Domain.Categories;

/// <summary>A menu category, scoped to a tenant.</summary>
public sealed class Category : Entity
{
    public Guid TenantId { get; private set; }
    public string Name { get; private set; }

    private Category() => Name = string.Empty; // EF

    public Category(Guid tenantId, string name)
    {
        TenantId = tenantId;
        Name = name;
    }

    public void Rename(string name) => Name = name;
}
