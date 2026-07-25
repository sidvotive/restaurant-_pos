using System.Security.Claims;
using Menu.Application.Menu;

namespace Identity.Api.Endpoints;

public static class MenuEndpoints
{
    public static IEndpointRouteBuilder MapMenuEndpoints(this IEndpointRouteBuilder app)
    {
        // All menu endpoints require a signed-in user; data is scoped to their tenant.
        var group = app.MapGroup("/api/menu").WithTags("Menu").RequireAuthorization();

        group.MapGet("/", async (ClaimsPrincipal user, IMenuService menu, CancellationToken ct) =>
            Results.Ok(await menu.GetMenuAsync(TenantId(user), ct)));

        group.MapPost("/categories", async (CreateCategoryRequest req, ClaimsPrincipal user, IMenuService menu, CancellationToken ct) =>
            Results.Ok(await menu.AddCategoryAsync(TenantId(user), req, ct)));

        group.MapPut("/categories/{id:guid}", async (Guid id, RenameCategoryRequest req, ClaimsPrincipal user, IMenuService menu, CancellationToken ct) =>
        {
            await menu.RenameCategoryAsync(TenantId(user), id, req, ct);
            return Results.NoContent();
        });

        group.MapDelete("/categories/{id:guid}", async (Guid id, ClaimsPrincipal user, IMenuService menu, CancellationToken ct) =>
        {
            await menu.RemoveCategoryAsync(TenantId(user), id, ct);
            return Results.NoContent();
        });

        group.MapPost("/products", async (CreateProductRequest req, ClaimsPrincipal user, IMenuService menu, CancellationToken ct) =>
            Results.Ok(await menu.AddProductAsync(TenantId(user), req, ct)));

        group.MapPut("/products/{id:guid}", async (Guid id, UpdateProductRequest req, ClaimsPrincipal user, IMenuService menu, CancellationToken ct) =>
        {
            await menu.UpdateProductAsync(TenantId(user), id, req, ct);
            return Results.NoContent();
        });

        group.MapDelete("/products/{id:guid}", async (Guid id, ClaimsPrincipal user, IMenuService menu, CancellationToken ct) =>
        {
            await menu.RemoveProductAsync(TenantId(user), id, ct);
            return Results.NoContent();
        });

        return app;
    }

    /// <summary>Reads the tenant from the JWT's tenant_id claim.</summary>
    private static Guid TenantId(ClaimsPrincipal user)
    {
        var raw = user.FindFirstValue("tenant_id");
        return Guid.TryParse(raw, out var id)
            ? id
            : throw new UnauthorizedAccessException("Missing or invalid tenant.");
    }
}
