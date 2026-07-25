using Microsoft.EntityFrameworkCore;
using Orders.Application.Common.Interfaces;
using Orders.Domain.Orders;

namespace Orders.Infrastructure.Persistence;

/// <summary>EF Core context for the Orders module (own tables in the shared database).</summary>
public sealed class OrdersDbContext(DbContextOptions<OrdersDbContext> options)
    : DbContext(options), IOrdersDbContext
{
    public DbSet<Order> Orders => Set<Order>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Order>(b =>
        {
            b.HasKey(o => o.Id);
            b.Property(o => o.Type).IsRequired().HasMaxLength(20);
            b.Property(o => o.Status).IsRequired().HasMaxLength(20);
            b.Property(o => o.PaymentMethod).HasMaxLength(20);
            b.Property(o => o.TableLabel).HasMaxLength(50);
            b.Property(o => o.CustomerName).HasMaxLength(200);
            b.Property(o => o.CustomerPhone).HasMaxLength(50);
            b.HasIndex(o => new { o.TenantId, o.Number });
            b.HasMany(o => o.Lines)
                .WithOne()
                .HasForeignKey(l => l.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<OrderLine>(b =>
        {
            b.HasKey(l => l.Id);
            b.Property(l => l.Name).IsRequired().HasMaxLength(200);
        });
    }
}
