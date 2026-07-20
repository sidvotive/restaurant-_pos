using Identity.Application.Common.Interfaces;
using Identity.Domain.Auth;
using Identity.Domain.Users;

namespace Identity.Application.Auth;

/// <summary>
/// Issues an access + refresh token pair for a user, persisting the refresh
/// token hash. Shared by register and login so token issuance stays consistent.
/// </summary>
internal sealed class AuthTokenFactory(
    IApplicationDbContext db,
    IJwtTokenService jwt,
    IRefreshTokenService refresh)
{
    public async Task<AuthResponse> IssueAsync(User user, CancellationToken ct)
    {
        var access = jwt.GenerateAccessToken(user);
        var newRefresh = refresh.Create();

        db.RefreshTokens.Add(new RefreshToken(user.Id, newRefresh.Hash, newRefresh.ExpiresAt));
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
