using Menu.Application.Common;
using Menu.Application.Common.Interfaces;
using Menu.Domain.Categories;
using Menu.Domain.Products;
using Microsoft.EntityFrameworkCore;

namespace Menu.Application.Menu;

public interface IMenuService
{
    Task<MenuDto> GetMenuAsync(Guid tenantId, CancellationToken ct);
    Task<CategoryDto> AddCategoryAsync(Guid tenantId, CreateCategoryRequest request, CancellationToken ct);
    Task RenameCategoryAsync(Guid tenantId, Guid categoryId, RenameCategoryRequest request, CancellationToken ct);
    Task RemoveCategoryAsync(Guid tenantId, Guid categoryId, CancellationToken ct);
    Task<ProductDto> AddProductAsync(Guid tenantId, CreateProductRequest request, CancellationToken ct);
    Task UpdateProductAsync(Guid tenantId, Guid productId, UpdateProductRequest request, CancellationToken ct);
    Task RemoveProductAsync(Guid tenantId, Guid productId, CancellationToken ct);
}

/// <summary>Menu use cases. Every query and mutation is scoped to the tenant.</summary>
public sealed class MenuService(IMenuDbContext db) : IMenuService
{
    public async Task<MenuDto> GetMenuAsync(Guid tenantId, CancellationToken ct)
    {
        var categories = await db.Categories
            .Where(c => c.TenantId == tenantId)
            .Select(c => new CategoryDto(c.Id, c.Name))
            .ToListAsync(ct);

        var products = await db.Products
            .Where(p => p.TenantId == tenantId)
            .Select(p => new ProductDto(p.Id, p.CategoryId, p.Name, p.PriceMinor))
            .ToListAsync(ct);

        return new MenuDto(categories, products);
    }

    public async Task<CategoryDto> AddCategoryAsync(Guid tenantId, CreateCategoryRequest request, CancellationToken ct)
    {
        var name = Require(request.Name, "Category name is required.");
        var category = new Category(tenantId, name);
        db.Categories.Add(category);
        await db.SaveChangesAsync(ct);
        return new CategoryDto(category.Id, category.Name);
    }

    public async Task RenameCategoryAsync(Guid tenantId, Guid categoryId, RenameCategoryRequest request, CancellationToken ct)
    {
        var name = Require(request.Name, "Category name is required.");
        var category = await FindCategory(tenantId, categoryId, ct);
        category.Rename(name);
        await db.SaveChangesAsync(ct);
    }

    public async Task RemoveCategoryAsync(Guid tenantId, Guid categoryId, CancellationToken ct)
    {
        var category = await FindCategory(tenantId, categoryId, ct);
        var products = await db.Products
            .Where(p => p.TenantId == tenantId && p.CategoryId == categoryId)
            .ToListAsync(ct);
        db.Products.RemoveRange(products);
        db.Categories.Remove(category);
        await db.SaveChangesAsync(ct);
    }

    public async Task<ProductDto> AddProductAsync(Guid tenantId, CreateProductRequest request, CancellationToken ct)
    {
        var name = Require(request.Name, "Product name is required.");
        if (request.PriceMinor < 0) throw new ValidationException("Price cannot be negative.");

        var categoryExists = await db.Categories.AnyAsync(
            c => c.Id == request.CategoryId && c.TenantId == tenantId, ct);
        if (!categoryExists) throw new ValidationException("Category does not exist.");

        var product = new Product(tenantId, request.CategoryId, name, request.PriceMinor);
        db.Products.Add(product);
        await db.SaveChangesAsync(ct);
        return new ProductDto(product.Id, product.CategoryId, product.Name, product.PriceMinor);
    }

    public async Task UpdateProductAsync(Guid tenantId, Guid productId, UpdateProductRequest request, CancellationToken ct)
    {
        var name = Require(request.Name, "Product name is required.");
        if (request.PriceMinor < 0) throw new ValidationException("Price cannot be negative.");

        var product = await db.Products.FirstOrDefaultAsync(
            p => p.Id == productId && p.TenantId == tenantId, ct)
            ?? throw new NotFoundException("Product not found.");

        product.Update(request.CategoryId, name, request.PriceMinor);
        await db.SaveChangesAsync(ct);
    }

    public async Task RemoveProductAsync(Guid tenantId, Guid productId, CancellationToken ct)
    {
        var product = await db.Products.FirstOrDefaultAsync(
            p => p.Id == productId && p.TenantId == tenantId, ct)
            ?? throw new NotFoundException("Product not found.");
        db.Products.Remove(product);
        await db.SaveChangesAsync(ct);
    }

    private async Task<Category> FindCategory(Guid tenantId, Guid categoryId, CancellationToken ct) =>
        await db.Categories.FirstOrDefaultAsync(c => c.Id == categoryId && c.TenantId == tenantId, ct)
        ?? throw new NotFoundException("Category not found.");

    private static string Require(string? value, string message)
    {
        var trimmed = (value ?? string.Empty).Trim();
        if (trimmed.Length == 0) throw new ValidationException(message);
        return trimmed;
    }
}
