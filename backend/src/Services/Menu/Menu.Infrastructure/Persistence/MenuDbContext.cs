using Menu.Application.Common.Interfaces;
using Menu.Domain.Categories;
using Menu.Domain.Products;
using Microsoft.EntityFrameworkCore;

namespace Menu.Infrastructure.Persistence;

/// <summary>EF Core context for the Menu module (its own tables in the shared database).</summary>
public sealed class MenuDbContext(DbContextOptions<MenuDbContext> options)
    : DbContext(options), IMenuDbContext
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Category>(b =>
        {
            b.HasKey(c => c.Id);
            b.Property(c => c.Name).IsRequired().HasMaxLength(200);
            b.HasIndex(c => c.TenantId);
        });

        modelBuilder.Entity<Product>(b =>
        {
            b.HasKey(p => p.Id);
            b.Property(p => p.Name).IsRequired().HasMaxLength(200);
            b.HasIndex(p => new { p.TenantId, p.CategoryId });
        });
    }
}
