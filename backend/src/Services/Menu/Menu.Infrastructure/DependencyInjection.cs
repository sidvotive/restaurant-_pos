using Menu.Application.Common.Interfaces;
using Menu.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Menu.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddMenuInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<MenuDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("Postgres")));
        services.AddScoped<IMenuDbContext>(sp => sp.GetRequiredService<MenuDbContext>());
        return services;
    }
}
