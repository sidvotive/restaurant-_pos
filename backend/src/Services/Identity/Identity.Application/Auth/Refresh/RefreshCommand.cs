using Identity.Application.Common;
using Identity.Application.Common.Interfaces;
using Identity.Domain.Auth;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Identity.Application.Auth.Refresh;

/// <summary>Exchanges a valid refresh token for a new access + refresh pair (rotation).</summary>
public sealed record RefreshCommand(string RefreshToken) : IRequest<AuthResponse>;

internal sealed class RefreshCommandHandler(
    IApplicationDbContext db,
    IJwtTokenService jwt,
    IRefreshTokenService refresh,
    TimeProvider clock) : IRequestHandler<RefreshCommand, AuthResponse>
{
    public async Task<AuthResponse> Handle(RefreshCommand request, CancellationToken ct)
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

        return new AuthResponse(
            access.Token,
            access.ExpiresAt,
            newRefresh.Raw,
            user.Id,
            user.TenantId,
            user.Email,
            user.Role.ToString());
    }
}
