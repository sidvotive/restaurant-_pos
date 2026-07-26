using Tables.Domain.Common;

namespace Tables.Domain.Tables;

/// <summary>
/// A dine-in table on the floor plan, scoped to a tenant. Status is one of
/// <c>free</c>, <c>occupied</c>, or <c>reserved</c>; a reservation name is kept
/// only while the table is reserved.
/// </summary>
public sealed class RestaurantTable : Entity
{
    public Guid TenantId { get; private set; }
    public string Label { get; private set; } = string.Empty;
    public string Area { get; private set; } = string.Empty;
    public int Seats { get; private set; }
    public string Status { get; private set; } = "free";
    public string? ReservedFor { get; private set; }

    private RestaurantTable() { } // EF

    public RestaurantTable(Guid tenantId, string label, string area, int seats, string status = "free")
    {
        TenantId = tenantId;
        Label = label;
        Area = area;
        Seats = Math.Max(0, seats);
        Status = status;
    }

    /// <summary>Changes the table's status, clearing any reservation once it is no longer reserved.</summary>
    public void SetStatus(string status)
    {
        Status = status;
        if (status != "reserved") ReservedFor = null;
    }

    /// <summary>Marks the table reserved for a guest (a blank name reserves it anonymously).</summary>
    public void Reserve(string? name)
    {
        Status = "reserved";
        var trimmed = name?.Trim();
        ReservedFor = string.IsNullOrEmpty(trimmed) ? null : trimmed;
    }
}
