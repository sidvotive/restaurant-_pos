using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Tables.Application.Common.Interfaces;
using Tables.Infrastructure.Persistence;

namespace Tables.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddTablesInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<TablesDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("Postgres")));
        services.AddScoped<ITablesDbContext>(sp => sp.GetRequiredService<TablesDbContext>());
        return services;
    }
}
