namespace Identity.Application.Common.Interfaces;

/// <summary>
/// A freshly created refresh token: the raw value goes to the client once,
/// only <see cref="Hash"/> is persisted.
/// </summary>
public sealed record NewRefreshToken(string Raw, string Hash, DateTimeOffset ExpiresAt);

/// <summary>Creates and hashes refresh tokens.</summary>
public interface IRefreshTokenService
{
    NewRefreshToken Create();

    /// <summary>Hashes a raw token so an incoming value can be matched against storage.</summary>
    string HashRaw(string rawToken);
}
