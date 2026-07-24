using Identity.Application.Auth;

namespace Identity.Api.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Auth");

        group.MapPost("/register", async (RegisterRequest request, IAuthService auth, CancellationToken ct) =>
            Results.Ok(await auth.RegisterAsync(request, ct)));

        group.MapPost("/login", async (LoginRequest request, IAuthService auth, CancellationToken ct) =>
            Results.Ok(await auth.LoginAsync(request, ct)));

        group.MapPost("/refresh", async (RefreshRequest request, IAuthService auth, CancellationToken ct) =>
            Results.Ok(await auth.RefreshAsync(request, ct)));

        return app;
    }
}
