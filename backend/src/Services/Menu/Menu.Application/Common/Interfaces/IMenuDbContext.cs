using Menu.Domain.Categories;
using Menu.Domain.Products;
using Microsoft.EntityFrameworkCore;

namespace Menu.Application.Common.Interfaces;

public interface IMenuDbContext
{
    DbSet<Category> Categories { get; }
    DbSet<Product> Products { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
