namespace Menu.Application.Menu;

public sealed record CategoryDto(Guid Id, string Name);

public sealed record ProductDto(Guid Id, Guid CategoryId, string Name, int PriceMinor);

/// <summary>The whole menu for a tenant (what the POS loads).</summary>
public sealed record MenuDto(IReadOnlyList<CategoryDto> Categories, IReadOnlyList<ProductDto> Products);

public sealed record CreateCategoryRequest(string Name);
public sealed record RenameCategoryRequest(string Name);
public sealed record CreateProductRequest(Guid CategoryId, string Name, int PriceMinor);
public sealed record UpdateProductRequest(Guid CategoryId, string Name, int PriceMinor);
