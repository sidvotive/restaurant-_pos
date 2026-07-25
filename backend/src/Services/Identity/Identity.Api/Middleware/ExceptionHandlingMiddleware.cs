using Microsoft.AspNetCore.Mvc;
using IdentityValidation = Identity.Application.Common.ValidationException;
using IdentityAuth = Identity.Application.Common.AuthenticationException;
using MenuValidation = Menu.Application.Common.ValidationException;
using MenuNotFound = Menu.Application.Common.NotFoundException;

namespace Identity.Api.Middleware;

/// <summary>Maps application exceptions (from any hosted module) to ProblemDetails.</summary>
public sealed class ExceptionHandlingMiddleware(
    RequestDelegate next,
    ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (IdentityValidation ex)
        {
            await WriteProblem(context, StatusCodes.Status400BadRequest, "Validation failed", ex.Message);
        }
        catch (MenuValidation ex)
        {
            await WriteProblem(context, StatusCodes.Status400BadRequest, "Validation failed", ex.Message);
        }
        catch (MenuNotFound ex)
        {
            await WriteProblem(context, StatusCodes.Status404NotFound, "Not found", ex.Message);
        }
        catch (IdentityAuth ex)
        {
            await WriteProblem(context, StatusCodes.Status401Unauthorized, "Authentication failed", ex.Message);
        }
        catch (UnauthorizedAccessException ex)
        {
            await WriteProblem(context, StatusCodes.Status401Unauthorized, "Unauthorized", ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception");
            await WriteProblem(
                context,
                StatusCodes.Status500InternalServerError,
                "Server error",
                "An unexpected error occurred.");
        }
    }

    private static async Task WriteProblem(HttpContext context, int status, string title, string detail)
    {
        context.Response.StatusCode = status;
        await context.Response.WriteAsJsonAsync(new ProblemDetails
        {
            Status = status,
            Title = title,
            Detail = detail,
        });
    }
}
