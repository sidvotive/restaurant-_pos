namespace Identity.Application.Common;

/// <summary>Input failed a business rule. Maps to HTTP 400.</summary>
public sealed class ValidationException(string message) : Exception(message);

/// <summary>Authentication failed (bad credentials / invalid token). Maps to HTTP 401.</summary>
public sealed class AuthenticationException(string message) : Exception(message);
