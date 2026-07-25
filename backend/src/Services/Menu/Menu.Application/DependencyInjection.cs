using Menu.Application.Menu;
using Microsoft.Extensions.DependencyInjection;

namespace Menu.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddMenuApplication(this IServiceCollection services)
    {
        services.AddScoped<IMenuService, MenuService>();
        return services;
    }
}
