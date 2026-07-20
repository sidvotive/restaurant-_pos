using Identity.Domain.Common;

namespace Identity.Domain.Users;

/// <summary>
/// An authenticated principal belonging to a tenant. Email is unique across
/// the system so it can be used as the login identifier.
/// </summary>
public sealed class User : Entity
{
    public Guid TenantId { get; private set; }
    public string Email { get; private set; }
    public string PasswordHash { get; private set; }
    public string FullName { get; private set; }
    public UserRole Role { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; } = DateTimeOffset.UtcNow;

    // Parameterless ctor for EF Core materialisation.
    private User()
    {
        Email = string.Empty;
        PasswordHash = string.Empty;
        FullName = string.Empty;
    }

    public User(Guid tenantId, string email, string passwordHash, string fullName, UserRole role)
    {
        TenantId = tenantId;
        Email = email;
        PasswordHash = passwordHash;
        FullName = fullName;
        Role = role;
    }

    public void SetPasswordHash(string passwordHash) => PasswordHash = passwordHash;
}
