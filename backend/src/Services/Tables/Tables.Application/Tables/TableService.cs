using Microsoft.EntityFrameworkCore;
using Tables.Application.Common;
using Tables.Application.Common.Interfaces;
using Tables.Domain.Tables;

namespace Tables.Application.Tables;

public interface ITableService
{
    Task<IReadOnlyList<TableDto>> GetTablesAsync(Guid tenantId, CancellationToken ct);
    Task<TableDto> SetStatusAsync(Guid tenantId, Guid tableId, string status, CancellationToken ct);
    Task<TableDto> ReserveAsync(Guid tenantId, Guid tableId, string? name, CancellationToken ct);
}

/// <summary>
/// Floor-plan use cases, scoped to the tenant. A tenant with no tables yet gets a
/// default layout seeded on first access, so the floor screen is never empty.
/// </summary>
public sealed class TableService(ITablesDbContext db) : ITableService
{
    private static readonly string[] AllowedStatuses = ["free", "occupied", "reserved"];

    public async Task<IReadOnlyList<TableDto>> GetTablesAsync(Guid tenantId, CancellationToken ct)
    {
        var tables = await db.Tables
            .Where(t => t.TenantId == tenantId)
            .ToListAsync(ct);

        if (tables.Count == 0)
        {
            tables = SeedDefaultLayout(tenantId);
            db.Tables.AddRange(tables);
            await db.SaveChangesAsync(ct);
        }

        return tables.Select(ToDto).ToList();
    }

    public async Task<TableDto> SetStatusAsync(Guid tenantId, Guid tableId, string status, CancellationToken ct)
    {
        var normalized = (status ?? string.Empty).Trim().ToLowerInvariant();
        if (!AllowedStatuses.Contains(normalized))
            throw new ValidationException($"Unknown table status '{status}'.");

        var table = await GetOwnedTableAsync(tenantId, tableId, ct);
        table.SetStatus(normalized);
        await db.SaveChangesAsync(ct);
        return ToDto(table);
    }

    public async Task<TableDto> ReserveAsync(Guid tenantId, Guid tableId, string? name, CancellationToken ct)
    {
        var table = await GetOwnedTableAsync(tenantId, tableId, ct);
        table.Reserve(name);
        await db.SaveChangesAsync(ct);
        return ToDto(table);
    }

    private async Task<RestaurantTable> GetOwnedTableAsync(Guid tenantId, Guid tableId, CancellationToken ct)
    {
        var table = await db.Tables.FirstOrDefaultAsync(
            t => t.TenantId == tenantId && t.Id == tableId, ct);
        return table ?? throw new NotFoundException("Table not found.");
    }

    private static List<RestaurantTable> SeedDefaultLayout(Guid tenantId) =>
    [
        new(tenantId, "T1", "Ground Floor", 2),
        new(tenantId, "T2", "Ground Floor", 2),
        new(tenantId, "T3", "Ground Floor", 4),
        new(tenantId, "T4", "Ground Floor", 4),
        new(tenantId, "T5", "Ground Floor", 6),
        new(tenantId, "B1", "Terrace", 2),
        new(tenantId, "B2", "Terrace", 4),
        new(tenantId, "B3", "Terrace", 4),
    ];

    private static TableDto ToDto(RestaurantTable t) =>
        new(t.Id.ToString(), t.Label, t.Area, t.Seats, t.Status, t.ReservedFor);
}
