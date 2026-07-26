using System.Security.Claims;
using Tables.Application.Tables;

namespace Identity.Api.Endpoints;

public static class TableEndpoints
{
    public static IEndpointRouteBuilder MapTableEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/tables").WithTags("Tables").RequireAuthorization();

        group.MapGet("/", async (ClaimsPrincipal user, ITableService tables, CancellationToken ct) =>
            Results.Ok(await tables.GetTablesAsync(TenantId(user), ct)));

        group.MapPut("/{id:guid}/status", async (Guid id, SetStatusRequest req, ClaimsPrincipal user, ITableService tables, CancellationToken ct) =>
            Results.Ok(await tables.SetStatusAsync(TenantId(user), id, req.Status, ct)));

        group.MapPost("/{id:guid}/reserve", async (Guid id, ReserveRequest req, ClaimsPrincipal user, ITableService tables, CancellationToken ct) =>
            Results.Ok(await tables.ReserveAsync(TenantId(user), id, req.Name, ct)));

        return app;
    }

    private static Guid TenantId(ClaimsPrincipal user)
    {
        var raw = user.FindFirstValue("tenant_id");
        return Guid.TryParse(raw, out var id)
            ? id
            : throw new UnauthorizedAccessException("Missing or invalid tenant.");
    }
}
