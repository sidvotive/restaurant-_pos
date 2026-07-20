using MediatR;

namespace Identity.Application.Common;

/// <summary>
/// Trivial query that demonstrates the CQRS + MediatR pipeline end to end.
/// Replace with real queries/commands as the Identity module is built.
/// </summary>
public sealed record PingQuery(string Message) : IRequest<string>;

public sealed class PingQueryHandler : IRequestHandler<PingQuery, string>
{
    public Task<string> Handle(PingQuery request, CancellationToken cancellationToken)
        => Task.FromResult($"pong: {request.Message}");
}
