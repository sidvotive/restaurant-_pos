using Identity.Application.Common.Interfaces;
using Identity.Domain.Users;
using Microsoft.AspNetCore.Identity;

namespace Identity.Infrastructure.Security;

/// <summary>
/// Wraps ASP.NET Core's <see cref="PasswordHasher{TUser}"/> (PBKDF2) behind the
/// application's <see cref="IPasswordHasher"/> port. The user argument the
/// framework hasher takes is unused, so a throwaway instance is passed.
/// </summary>
public sealed class PasswordHasherAdapter : IPasswordHasher
{
    private static readonly User Placeholder =
        new(Guid.Empty, string.Empty, string.Empty, string.Empty, UserRole.Owner);

    private readonly PasswordHasher<User> _hasher = new();

    public string Hash(string password) => _hasher.HashPassword(Placeholder, password);

    public bool Verify(string hash, string password)
    {
        var result = _hasher.VerifyHashedPassword(Placeholder, hash, password);
        return result != PasswordVerificationResult.Failed;
    }
}
