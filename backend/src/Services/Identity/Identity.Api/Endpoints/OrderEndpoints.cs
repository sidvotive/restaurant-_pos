using System.Security.Claims;
using Orders.Application.Orders;

namespace Identity.Api.Endpoints;

public static class OrderEndpoints
{
    public static IEndpointRouteBuilder MapOrderEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/orders").WithTags("Orders").RequireAuthorization();

        group.MapGet("/", async (ClaimsPrincipal user, IOrderService orders, CancellationToken ct) =>
            Results.Ok(await orders.GetOrdersAsync(TenantId(user), ct)));

        group.MapPost("/", async (PlaceOrderRequest req, ClaimsPrincipal user, IOrderService orders, CancellationToken ct) =>
            Results.Ok(await orders.PlaceOrderAsync(TenantId(user), req, ct)));

        group.MapPost("/{id:guid}/advance", async (Guid id, ClaimsPrincipal user, IOrderService orders, CancellationToken ct) =>
        {
            await orders.AdvanceOrderAsync(TenantId(user), id, ct);
            return Results.NoContent();
        });

        group.MapPost("/{id:guid}/cancel", async (Guid id, ClaimsPrincipal user, IOrderService orders, CancellationToken ct) =>
        {
            await orders.CancelOrderAsync(TenantId(user), id, ct);
            return Results.NoContent();
        });

        group.MapDelete("/", async (ClaimsPrincipal user, IOrderService orders, CancellationToken ct) =>
        {
            await orders.ClearOrdersAsync(TenantId(user), ct);
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
