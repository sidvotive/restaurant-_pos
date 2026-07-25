using Microsoft.EntityFrameworkCore;
using Orders.Application.Common;
using Orders.Application.Common.Interfaces;
using Orders.Domain.Orders;

namespace Orders.Application.Orders;

public interface IOrderService
{
    Task<IReadOnlyList<OrderDto>> GetOrdersAsync(Guid tenantId, CancellationToken ct);
    Task<OrderDto> PlaceOrderAsync(Guid tenantId, PlaceOrderRequest request, CancellationToken ct);
    Task AdvanceOrderAsync(Guid tenantId, Guid orderId, CancellationToken ct);
    Task CancelOrderAsync(Guid tenantId, Guid orderId, CancellationToken ct);
    Task ClearOrdersAsync(Guid tenantId, CancellationToken ct);
}

/// <summary>Order use cases, all scoped to the tenant.</summary>
public sealed class OrderService(IOrdersDbContext db) : IOrderService
{
    public async Task<IReadOnlyList<OrderDto>> GetOrdersAsync(Guid tenantId, CancellationToken ct)
    {
        var orders = await db.Orders
            .Where(o => o.TenantId == tenantId)
            .Include(o => o.Lines)
            .OrderByDescending(o => o.Number)
            .ToListAsync(ct);
        return orders.Select(ToDto).ToList();
    }

    public async Task<OrderDto> PlaceOrderAsync(Guid tenantId, PlaceOrderRequest request, CancellationToken ct)
    {
        if (request.Lines is null || request.Lines.Count == 0)
            throw new ValidationException("An order needs at least one item.");

        var lastNumber = await db.Orders
            .Where(o => o.TenantId == tenantId)
            .MaxAsync(o => (int?)o.Number, ct) ?? 0;

        var order = new Order(
            tenantId,
            lastNumber + 1,
            request.Type,
            request.SubtotalMinor,
            request.DiscountMinor,
            request.TaxMinor,
            request.TipMinor,
            request.TotalMinor,
            request.TableLabel,
            request.PaymentMethod,
            request.CustomerName,
            request.CustomerPhone);

        foreach (var line in request.Lines)
        {
            var productId = Guid.TryParse(line.ProductId, out var pid) ? pid : (Guid?)null;
            order.AddLine(new OrderLine(productId, line.Name, line.UnitPriceMinor, line.Quantity));
        }

        db.Orders.Add(order);
        await db.SaveChangesAsync(ct);
        return ToDto(order);
    }

    public async Task AdvanceOrderAsync(Guid tenantId, Guid orderId, CancellationToken ct)
    {
        var order = await Find(tenantId, orderId, ct);
        order.Advance();
        await db.SaveChangesAsync(ct);
    }

    public async Task CancelOrderAsync(Guid tenantId, Guid orderId, CancellationToken ct)
    {
        var order = await Find(tenantId, orderId, ct);
        order.Cancel();
        await db.SaveChangesAsync(ct);
    }

    public async Task ClearOrdersAsync(Guid tenantId, CancellationToken ct)
    {
        var orders = await db.Orders.Where(o => o.TenantId == tenantId).ToListAsync(ct);
        db.Orders.RemoveRange(orders); // lines cascade
        await db.SaveChangesAsync(ct);
    }

    private async Task<Order> Find(Guid tenantId, Guid orderId, CancellationToken ct) =>
        await db.Orders.FirstOrDefaultAsync(o => o.Id == orderId && o.TenantId == tenantId, ct)
        ?? throw new NotFoundException("Order not found.");

    private static OrderDto ToDto(Order o) => new(
        o.Id.ToString(),
        o.Number,
        o.Type,
        o.Status,
        o.PlacedAt,
        o.SubtotalMinor,
        o.DiscountMinor,
        o.TaxMinor,
        o.TipMinor,
        o.TotalMinor,
        o.TableLabel,
        o.PaymentMethod,
        o.CustomerName,
        o.CustomerPhone,
        o.Lines
            .Select(l => new OrderLineDto(
                new OrderLineProductDto(l.ProductId?.ToString() ?? string.Empty, string.Empty, l.Name, l.UnitPriceMinor),
                l.Quantity))
            .ToList());
}
