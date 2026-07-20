using Identity.Application.Common;
using Identity.Application.Common.Interfaces;
using Identity.Domain.Tenants;
using Identity.Domain.Users;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Identity.Application.Auth.Register;

/// <summary>Registers a new tenant and its initial Owner user.</summary>
public sealed record RegisterCommand(
    string TenantName,
    string Email,
    string Password,
    string FullName) : IRequest<AuthResponse>;

internal sealed class RegisterCommandHandler(
    IApplicationDbContext db,
    IPasswordHasher hasher,
    AuthTokenFactory tokens) : IRequestHandler<RegisterCommand, AuthResponse>
{
    public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken ct)
    {
        var email = (request.Email ?? string.Empty).Trim().ToLowerInvariant();

        if (email.Length == 0 || !email.Contains('@'))
            throw new ValidationException("A valid email is required.");
        if ((request.Password ?? string.Empty).Length < 8)
            throw new ValidationException("Password must be at least 8 characters.");
        if (string.IsNullOrWhiteSpace(request.TenantName))
            throw new ValidationException("Tenant name is required.");

        if (await db.Users.AnyAsync(u => u.Email == email, ct))
            throw new ValidationException("Email is already registered.");

        var tenant = new Tenant(request.TenantName.Trim());
        db.Tenants.Add(tenant);

        var user = new User(
            tenant.Id,
            email,
            hasher.Hash(request.Password!),
            (request.FullName ?? string.Empty).Trim(),
            UserRole.Owner);
        db.Users.Add(user);

        return await tokens.IssueAsync(user, ct);
    }
}
