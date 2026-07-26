using Microsoft.Extensions.DependencyInjection;
using Tables.Application.Tables;

namespace Tables.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddTablesApplication(this IServiceCollection services)
    {
        services.AddScoped<ITableService, TableService>();
        return services;
    }
}
