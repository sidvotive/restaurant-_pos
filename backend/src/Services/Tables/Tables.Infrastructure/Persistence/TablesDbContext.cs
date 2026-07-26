using Microsoft.EntityFrameworkCore;
using Tables.Application.Common.Interfaces;
using Tables.Domain.Tables;

namespace Tables.Infrastructure.Persistence;

/// <summary>EF Core context for the Tables module (own tables in the shared database).</summary>
public sealed class TablesDbContext(DbContextOptions<TablesDbContext> options)
    : DbContext(options), ITablesDbContext
{
    public DbSet<RestaurantTable> Tables => Set<RestaurantTable>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<RestaurantTable>(b =>
        {
            b.HasKey(t => t.Id);
            b.Property(t => t.Label).HasMaxLength(32);
            b.Property(t => t.Area).HasMaxLength(64);
            b.Property(t => t.Status).HasMaxLength(16);
            b.Property(t => t.ReservedFor).HasMaxLength(128);
            b.HasIndex(t => t.TenantId);
        });
    }
}
