using System.Security.Cryptography;
using System.Text;
using Identity.Application.Common.Interfaces;
using Microsoft.Extensions.Options;

namespace Identity.Infrastructure.Security;

public sealed class RefreshTokenService(IOptions<JwtOptions> options, TimeProvider clock)
    : IRefreshTokenService
{
    private readonly JwtOptions _options = options.Value;

    public NewRefreshToken Create()
    {
        var raw = ToBase64Url(RandomNumberGenerator.GetBytes(32));
        var expiresAt = clock.GetUtcNow().AddDays(_options.RefreshTokenDays);
        return new NewRefreshToken(raw, HashRaw(raw), expiresAt);
    }

    public string HashRaw(string rawToken)
    {
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(rawToken));
        return Convert.ToHexString(hash);
    }

    private static string ToBase64Url(byte[] bytes) =>
        Convert.ToBase64String(bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');
}
