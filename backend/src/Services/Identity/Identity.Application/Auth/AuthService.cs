using Identity.Application.Common;
using Identity.Application.Common.Interfaces;
using Identity.Domain.Auth;
using Identity.Domain.Tenants;
using Identity.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace Identity.Application.Auth;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken ct);
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct);
    Task<AuthResponse> RefreshAsync(RefreshRequest request, CancellationToken ct);
}

/// <summary>
/// Authentication use cases as plain injectable methods (no MediatR/CQRS).
/// Depends only on ports, so it stays independent of EF/JWT specifics.
/// </summary>
public sealed class AuthService(
    IApplicationDbContext db,
    IPasswordHasher hasher,
    IJwtTokenService jwt,
    IRefreshTokenService refresh,
    TimeProvider clock) : IAuthService
{
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken ct)
    {
        var email = (request.Email ?? string.Empty).Trim().ToLowerInvariant();

        if (email.Length == 0 || !email.Contains('@'))
            throw new ValidationException("A valid email is required.");
        if ((request.Password ?? string.Empty).Length < 8)
            throw new ValidationException("Password must be at least 8 characters.");
        if (string.IsNullOrWhiteSpace(request.TenantName))
            throw new ValidationException("Tenant name is required.");

        if (await db.Users.AnyAsync(u => u.Email == email, ct))
            throw new ValidationException("Email is already registered.");

        var tenant = new Tenant(request.TenantName.Trim());
        db.Tenants.Add(tenant);

        var user = new User(
            tenant.Id,
            email,
            hasher.Hash(request.Password!),
            (request.FullName ?? string.Empty).Trim(),
            UserRole.Owner);
        db.Users.Add(user);

        return await IssueAsync(user, ct);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct)
    {
        var email = (request.Email ?? string.Empty).Trim().ToLowerInvariant();
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email, ct);

        // Same error whether the user is missing or the password is wrong, so
        // the endpoint does not reveal which emails are registered.
        if (user is null || !hasher.Verify(user.PasswordHash, request.Password ?? string.Empty))
            throw new AuthenticationException("Invalid email or password.");

        return await IssueAsync(user, ct);
    }

    public async Task<AuthResponse> RefreshAsync(RefreshRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
            throw new AuthenticationException("Refresh token is required.");

        var now = clock.GetUtcNow();
        var hash = refresh.HashRaw(request.RefreshToken);

        var existing = await db.RefreshTokens.FirstOrDefaultAsync(t => t.TokenHash == hash, ct);
        if (existing is null || !existing.IsActive(now))
            throw new AuthenticationException("Invalid or expired refresh token.");

        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == existing.UserId, ct);
        if (user is null)
            throw new AuthenticationException("Invalid refresh token.");

        // Rotate: revoke the presented token and link it to its replacement.
        var newRefresh = refresh.Create();
        existing.Revoke(now, newRefresh.Hash);
        db.RefreshTokens.Add(new RefreshToken(user.Id, newRefresh.Hash, newRefresh.ExpiresAt));

        var access = jwt.GenerateAccessToken(user);
        await db.SaveChangesAsync(ct);

        return Build(user, access, newRefresh.Raw);
    }

    /// <summary>Issues a fresh access + refresh pair for a user and persists the refresh hash.</summary>
    private async Task<AuthResponse> IssueAsync(User user, CancellationToken ct)
    {
        var access = jwt.GenerateAccessToken(user);
        var newRefresh = refresh.Create();

        db.RefreshTokens.Add(new RefreshToken(user.Id, newRefresh.Hash, newRefresh.ExpiresAt));
        await db.SaveChangesAsync(ct);

        return Build(user, access, newRefresh.Raw);
    }

    private static AuthResponse Build(User user, AccessToken access, string rawRefresh) =>
        new(access.Token, access.ExpiresAt, rawRefresh, user.Id, user.TenantId, user.Email, user.Role.ToString());
}
