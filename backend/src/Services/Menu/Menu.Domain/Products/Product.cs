using Menu.Domain.Common;

namespace Menu.Domain.Products;

/// <summary>A menu product within a category, scoped to a tenant.</summary>
public sealed class Product : Entity
{
    public Guid TenantId { get; private set; }
    public Guid CategoryId { get; private set; }
    public string Name { get; private set; }
    /// <summary>Price in integer minor units (paise).</summary>
    public int PriceMinor { get; private set; }

    private Product() => Name = string.Empty; // EF

    public Product(Guid tenantId, Guid categoryId, string name, int priceMinor)
    {
        TenantId = tenantId;
        CategoryId = categoryId;
        Name = name;
        PriceMinor = priceMinor;
    }

    public void Update(Guid categoryId, string name, int priceMinor)
    {
        CategoryId = categoryId;
        Name = name;
        PriceMinor = priceMinor;
    }
}
