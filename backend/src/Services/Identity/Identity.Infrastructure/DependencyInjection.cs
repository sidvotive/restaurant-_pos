using Identity.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Identity.Infrastructure;

public static class DependencyInjection
{
    /// <summary>Registers the infrastructure layer (EF Core, PostgreSQL) into the DI container.</summary>
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Postgres");
        services.AddDbContext<IdentityDbContext>(options =>
            options.UseNpgsql(connectionString));
        return services;
    }
}
