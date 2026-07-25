using Inventory.Application.Common.Interfaces;
using Inventory.Domain.Stock;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Application.Inventory;

public interface IInventoryService
{
    Task<IReadOnlyList<StockDto>> GetStockAsync(Guid tenantId, CancellationToken ct);
    Task<StockDto> SetStockAsync(Guid tenantId, Guid productId, int quantity, CancellationToken ct);
    Task DecrementAsync(Guid tenantId, IReadOnlyList<DecrementLine> lines, CancellationToken ct);
}

/// <summary>Stock use cases, scoped to the tenant. Only tracked products are decremented.</summary>
public sealed class InventoryService(IInventoryDbContext db) : IInventoryService
{
    public async Task<IReadOnlyList<StockDto>> GetStockAsync(Guid tenantId, CancellationToken ct)
    {
        return await db.StockItems
            .Where(s => s.TenantId == tenantId)
            .Select(s => new StockDto(s.ProductId.ToString(), s.Quantity))
            .ToListAsync(ct);
    }

    public async Task<StockDto> SetStockAsync(Guid tenantId, Guid productId, int quantity, CancellationToken ct)
    {
        var item = await db.StockItems.FirstOrDefaultAsync(
            s => s.TenantId == tenantId && s.ProductId == productId, ct);

        if (item is null)
        {
            item = new StockItem(tenantId, productId, quantity);
            db.StockItems.Add(item);
        }
        else
        {
            item.SetQuantity(quantity);
        }

        await db.SaveChangesAsync(ct);
        return new StockDto(item.ProductId.ToString(), item.Quantity);
    }

    public async Task DecrementAsync(Guid tenantId, IReadOnlyList<DecrementLine> lines, CancellationToken ct)
    {
        foreach (var line in lines)
        {
            if (!Guid.TryParse(line.ProductId, out var productId)) continue;
            var item = await db.StockItems.FirstOrDefaultAsync(
                s => s.TenantId == tenantId && s.ProductId == productId, ct);
            item?.Decrement(line.Quantity);
        }
        await db.SaveChangesAsync(ct);
    }
}
