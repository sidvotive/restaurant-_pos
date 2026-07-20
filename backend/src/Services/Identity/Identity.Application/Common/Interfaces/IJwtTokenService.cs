using Identity.Domain.Users;

namespace Identity.Application.Common.Interfaces;

public sealed record AccessToken(string Token, DateTimeOffset ExpiresAt);

/// <summary>Issues signed JWT access tokens for authenticated users.</summary>
public interface IJwtTokenService
{
    AccessToken GenerateAccessToken(User user);
}
