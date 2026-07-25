using Inventory.Domain.Stock;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Application.Common.Interfaces;

public interface IInventoryDbContext
{
    DbSet<StockItem> StockItems { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
