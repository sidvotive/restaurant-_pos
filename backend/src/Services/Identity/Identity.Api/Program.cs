using System.Text;
using Identity.Api.Endpoints;
using Identity.Api.Middleware;
using Identity.Application;
using Identity.Application.Common;
using Identity.Infrastructure;
using Identity.Infrastructure.Security;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Compose the Clean Architecture layers.
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddEndpointsApiExplorer();

// JWT bearer authentication using the same signing key the tokens are issued with.
var jwt = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>() ?? new JwtOptions();
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwt.Issuer,
            ValidateAudience = true,
            ValidAudience = jwt.Audience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Secret)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromSeconds(30),
        };
    });
builder.Services.AddAuthorization();

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseAuthentication();
app.UseAuthorization();

// Liveness probe.
app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "identity" }));

// Demonstrates the CQRS/MediatR pipeline.
app.MapGet("/ping", async (IMediator mediator) =>
{
    var result = await mediator.Send(new PingQuery("identity"));
    return Results.Ok(new { message = result });
});

// Auth: register / login / refresh.
app.MapAuthEndpoints();

app.Run();
