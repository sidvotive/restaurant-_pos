using System.Text;
using Identity.Api.Endpoints;
using Identity.Api.Middleware;
using Identity.Application;
using Identity.Infrastructure;
using Identity.Infrastructure.Security;
using Menu.Application;
using Menu.Infrastructure;
using Orders.Application;
using Orders.Infrastructure;
using Inventory.Application;
using Inventory.Infrastructure;
using Tables.Application;
using Tables.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Compose the Clean Architecture layers.
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddMenuApplication();
builder.Services.AddMenuInfrastructure(builder.Configuration);
builder.Services.AddOrdersApplication();
builder.Services.AddOrdersInfrastructure(builder.Configuration);
builder.Services.AddInventoryApplication();
builder.Services.AddInventoryInfrastructure(builder.Configuration);
builder.Services.AddTablesApplication();
builder.Services.AddTablesInfrastructure(builder.Configuration);
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

// Dev-friendly CORS. The frontend normally reaches the API through the Vite
// proxy (same origin), so this mainly covers calling the API directly.
// Bearer-token auth (no cookies), so AllowAnyOrigin is safe. Restrict in prod.
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// Liveness probe.
app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "identity" }));

// Auth: register / login / refresh.
app.MapAuthEndpoints();
// Menu module (tenant-scoped CRUD).
app.MapMenuEndpoints();
// Orders module (tenant-scoped).
app.MapOrderEndpoints();
// Inventory module (tenant-scoped).
app.MapInventoryEndpoints();
// Tables module (tenant-scoped floor plan).
app.MapTableEndpoints();

app.Run();
