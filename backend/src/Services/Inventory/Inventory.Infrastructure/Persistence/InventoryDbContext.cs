using Inventory.Application.Common.Interfaces;
using Inventory.Domain.Stock;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Infrastructure.Persistence;

/// <summary>EF Core context for the Inventory module (own tables in the shared database).</summary>
public sealed class InventoryDbContext(DbContextOptions<InventoryDbContext> options)
    : DbContext(options), IInventoryDbContext
{
    public DbSet<StockItem> StockItems => Set<StockItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<StockItem>(b =>
        {
            b.HasKey(s => s.Id);
            // One stock row per product per tenant.
            b.HasIndex(s => new { s.TenantId, s.ProductId }).IsUnique();
        });
    }
}
