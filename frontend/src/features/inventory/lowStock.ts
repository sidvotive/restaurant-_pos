import type { Product } from '../../types/domain'

/** At or below this tracked quantity, an item is considered low on stock. */
export const LOW_STOCK_THRESHOLD = 5

export interface StockedProduct {
  product: Product
  quantity: number
}

/** Tracked products at or below the low-stock threshold. */
export function lowStockItems(
  products: Product[],
  stock: Record<string, number>,
  threshold = LOW_STOCK_THRESHOLD,
): StockedProduct[] {
  return products
    .filter((p) => p.id in stock && stock[p.id] <= threshold)
    .map((p) => ({ product: p, quantity: stock[p.id] }))
}
