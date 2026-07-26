namespace Menu.Application.Common;

/// <summary>Input failed a business rule. Maps to HTTP 400.</summary>
public sealed class ValidationException(string message) : Exception(message);

/// <summary>A referenced entity does not exist. Maps to HTTP 404.</summary>
public sealed class NotFoundException(string message) : Exception(message);
