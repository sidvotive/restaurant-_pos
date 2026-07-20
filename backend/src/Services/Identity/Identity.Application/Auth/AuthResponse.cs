namespace Identity.Application.Auth;

/// <summary>Result of a successful register/login/refresh.</summary>
public sealed record AuthResponse(
    string AccessToken,
    DateTimeOffset AccessTokenExpiresAt,
    string RefreshToken,
    Guid UserId,
    Guid TenantId,
    string Email,
    string Role);
