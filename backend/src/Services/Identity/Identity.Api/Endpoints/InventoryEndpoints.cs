using System.Security.Claims;
using Inventory.Application.Inventory;

namespace Identity.Api.Endpoints;

public static class InventoryEndpoints
{
    public static IEndpointRouteBuilder MapInventoryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/inventory").WithTags("Inventory").RequireAuthorization();

        group.MapGet("/", async (ClaimsPrincipal user, IInventoryService inventory, CancellationToken ct) =>
            Results.Ok(await inventory.GetStockAsync(TenantId(user), ct)));

        group.MapPut("/{productId:guid}", async (Guid productId, SetStockRequest req, ClaimsPrincipal user, IInventoryService inventory, CancellationToken ct) =>
            Results.Ok(await inventory.SetStockAsync(TenantId(user), productId, req.Quantity, ct)));

        group.MapPost("/decrement", async (List<DecrementLine> lines, ClaimsPrincipal user, IInventoryService inventory, CancellationToken ct) =>
        {
            await inventory.DecrementAsync(TenantId(user), lines, ct);
            return Results.NoContent();
        });

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
