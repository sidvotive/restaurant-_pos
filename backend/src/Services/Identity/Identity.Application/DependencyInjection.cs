using System.Reflection;
using Identity.Application.Auth;
using Microsoft.Extensions.DependencyInjection;

namespace Identity.Application;

public static class DependencyInjection
{
    /// <summary>Registers the application layer (MediatR handlers, helpers) into the DI container.</summary>
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

        services.AddScoped<AuthTokenFactory>();

        return services;
    }
}
