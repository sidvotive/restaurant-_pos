namespace Tables.Application.Tables;

public sealed record TableDto(string Id, string Label, string Area, int Seats, string Status, string? ReservedFor);

public sealed record SetStatusRequest(string Status);

public sealed record ReserveRequest(string? Name);
