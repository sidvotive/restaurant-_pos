namespace Identity.Application.Auth;

/// <summary>Registers a new tenant and its initial Owner user.</summary>
public sealed record RegisterRequest(string TenantName, string Email, string Password, string FullName);

/// <summary>Authenticates a user by email + password.</summary>
public sealed record LoginRequest(string Email, string Password);

/// <summary>Exchanges a valid refresh token for a new access + refresh pair.</summary>
public sealed record RefreshRequest(string RefreshToken);
