namespace Orders.Application.Orders;

// --- Response DTOs (shaped to match the client's Order model) ---

public sealed record OrderLineProductDto(string Id, string CategoryId, string Name, int PriceMinor);

public sealed record OrderLineDto(OrderLineProductDto Product, int Quantity);

public sealed record OrderDto(
    string Id,
    int Number,
    string Type,
    string Status,
    DateTimeOffset PlacedAt,
    int SubtotalMinor,
    int DiscountMinor,
    int TaxMinor,
    int TipMinor,
    int TotalMinor,
    string? TableLabel,
    string? PaymentMethod,
    string? CustomerName,
    string? CustomerPhone,
    IReadOnlyList<OrderLineDto> Lines);

// --- Request DTOs ---

public sealed record PlaceLineRequest(string? ProductId, string Name, int UnitPriceMinor, int Quantity);

public sealed record PlaceOrderRequest(
    string Type,
    IReadOnlyList<PlaceLineRequest> Lines,
    int SubtotalMinor,
    int DiscountMinor,
    int TaxMinor,
    int TipMinor,
    int TotalMinor,
    string? TableLabel,
    string? PaymentMethod,
    string? CustomerName,
    string? CustomerPhone);
