using Identity.Application;
using Identity.Application.Common;
using Identity.Infrastructure;
using MediatR;

var builder = WebApplication.CreateBuilder(args);

// Compose the Clean Architecture layers.
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// Liveness probe.
app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "identity" }));

// Demonstrates the CQRS/MediatR pipeline. Replace with real endpoints.
app.MapGet("/ping", async (IMediator mediator) =>
{
    var result = await mediator.Send(new PingQuery("identity"));
    return Results.Ok(new { message = result });
});

app.Run();
