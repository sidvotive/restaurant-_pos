namespace Inventory.Application.Inventory;

public sealed record StockDto(string ProductId, int Quantity);

public sealed record SetStockRequest(int Quantity);

public sealed record DecrementLine(string ProductId, int Quantity);
