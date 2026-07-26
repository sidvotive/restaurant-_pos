using Inventory.Domain.Common;

namespace Inventory.Domain.Stock;

/// <summary>Tracked stock for a product, scoped to a tenant. Quantity never goes below zero.</summary>
public sealed class StockItem : Entity
{
    public Guid TenantId { get; private set; }
    public Guid ProductId { get; private set; }
    public int Quantity { get; private set; }

    private StockItem() { } // EF

    public StockItem(Guid tenantId, Guid productId, int quantity)
    {
        TenantId = tenantId;
        ProductId = productId;
        Quantity = Math.Max(0, quantity);
    }

    public void SetQuantity(int quantity) => Quantity = Math.Max(0, quantity);

    public void Decrement(int by) => Quantity = Math.Max(0, Quantity - by);
}
