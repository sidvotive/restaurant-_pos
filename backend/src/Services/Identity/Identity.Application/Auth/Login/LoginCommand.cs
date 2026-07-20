using Identity.Application.Common;
using Identity.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Identity.Application.Auth.Login;

/// <summary>Authenticates a user by email + password.</summary>
public sealed record LoginCommand(string Email, string Password) : IRequest<AuthResponse>;

internal sealed class LoginCommandHandler(
    IApplicationDbContext db,
    IPasswordHasher hasher,
    AuthTokenFactory tokens) : IRequestHandler<LoginCommand, AuthResponse>
{
    public async Task<AuthResponse> Handle(LoginCommand request, CancellationToken ct)
    {
        var email = (request.Email ?? string.Empty).Trim().ToLowerInvariant();
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email, ct);

        // Same error whether the user is missing or the password is wrong, so
        // the endpoint does not reveal which emails are registered.
        if (user is null || !hasher.Verify(user.PasswordHash, request.Password ?? string.Empty))
            throw new AuthenticationException("Invalid email or password.");

        return await tokens.IssueAsync(user, ct);
    }
}
