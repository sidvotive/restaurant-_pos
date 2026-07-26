using Orders.Domain.Common;

namespace Orders.Domain.Orders;

/// <summary>
/// A customer order. Status/type/payment are stored as the same lowercase
/// strings the client uses, to keep the contract simple and exact.
/// </summary>
public sealed class Order : Entity
{
    public Guid TenantId { get; private set; }
    public int Number { get; private set; }
    public string Type { get; private set; }
    public string Status { get; private set; }
    public int SubtotalMinor { get; private set; }
    public int DiscountMinor { get; private set; }
    public int TaxMinor { get; private set; }
    public int TipMinor { get; private set; }
    public int TotalMinor { get; private set; }
    public string? TableLabel { get; private set; }
    public string? PaymentMethod { get; private set; }
    public string? CustomerName { get; private set; }
    public string? CustomerPhone { get; private set; }
    public DateTimeOffset PlacedAt { get; private set; } = DateTimeOffset.UtcNow;
    public List<OrderLine> Lines { get; private set; } = new();

    private Order()
    {
        Type = "dine-in";
        Status = "placed";
    }

    public Order(
        Guid tenantId,
        int number,
        string type,
        int subtotalMinor,
        int discountMinor,
        int taxMinor,
        int tipMinor,
        int totalMinor,
        string? tableLabel,
        string? paymentMethod,
        string? customerName,
        string? customerPhone)
    {
        TenantId = tenantId;
        Number = number;
        Type = type;
        Status = "placed";
        SubtotalMinor = subtotalMinor;
        DiscountMinor = discountMinor;
        TaxMinor = taxMinor;
        TipMinor = tipMinor;
        TotalMinor = totalMinor;
        TableLabel = tableLabel;
        PaymentMethod = paymentMethod;
        CustomerName = customerName;
        CustomerPhone = customerPhone;
    }

    public void AddLine(OrderLine line) => Lines.Add(line);

    /// <summary>Forward-only status progression.</summary>
    public void Advance() => Status = Status switch
    {
        "placed" => "preparing",
        "preparing" => "ready",
        "ready" => "served",
        _ => Status,
    };

    public void Cancel()
    {
        if (Status is not ("served" or "cancelled")) Status = "cancelled";
    }
}
