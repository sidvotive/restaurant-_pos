using Microsoft.EntityFrameworkCore;
using Tables.Domain.Tables;

namespace Tables.Application.Common.Interfaces;

public interface ITablesDbContext
{
    DbSet<RestaurantTable> Tables { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
