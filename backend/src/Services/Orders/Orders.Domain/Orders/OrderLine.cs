using Orders.Domain.Common;

namespace Orders.Domain.Orders;

/// <summary>A line on an order — a snapshot of the product at sale time.</summary>
public sealed class OrderLine : Entity
{
    public Guid OrderId { get; private set; }
    public Guid? ProductId { get; private set; }
    public string Name { get; private set; }
    public int UnitPriceMinor { get; private set; }
    public int Quantity { get; private set; }

    private OrderLine() => Name = string.Empty; // EF

    public OrderLine(Guid? productId, string name, int unitPriceMinor, int quantity)
    {
        ProductId = productId;
        Name = name;
        UnitPriceMinor = unitPriceMinor;
        Quantity = quantity;
    }
}
