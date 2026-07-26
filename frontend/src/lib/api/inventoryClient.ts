import type { CartLine } from '../../types/domain'
import { apiFetch } from './http'

interface StockDto {
  productId: string
  quantity: number
}

// Talks to the Inventory module (tenant-scoped; requires an authenticated session).
export const inventoryClient = {
  getStock: () => apiFetch<StockDto[]>('/api/inventory/'),
  setStock: (productId: string, quantity: number) =>
    apiFetch<StockDto>(`/api/inventory/${productId}`, { method: 'PUT', body: { quantity } }),
  decrement: (lines: CartLine[]) =>
    apiFetch<void>('/api/inventory/decrement', {
      method: 'POST',
      body: lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })),
    }),
}

/** Builds the productId → quantity map the store uses from the API response. */
export function toStockMap(dtos: StockDto[]): Record<string, number> {
  return Object.fromEntries(dtos.map((d) => [d.productId, d.quantity]))
}
