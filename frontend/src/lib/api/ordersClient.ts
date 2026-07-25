import type { Order } from '../../types/domain'
import { apiFetch } from './http'

export interface PlaceOrderBody {
  type: string
  lines: { productId: string | null; name: string; unitPriceMinor: number; quantity: number }[]
  subtotalMinor: number
  discountMinor: number
  taxMinor: number
  tipMinor: number
  totalMinor: number
  tableLabel?: string
  paymentMethod?: string
  customerName?: string
  customerPhone?: string
}

// Talks to the Orders module (tenant-scoped; requires an authenticated session).
export const ordersClient = {
  getOrders: () => apiFetch<Order[]>('/api/orders/'),
  place: (body: PlaceOrderBody) => apiFetch<Order>('/api/orders/', { method: 'POST', body }),
  advance: (id: string) => apiFetch<void>(`/api/orders/${id}/advance`, { method: 'POST' }),
  cancel: (id: string) => apiFetch<void>(`/api/orders/${id}/cancel`, { method: 'POST' }),
  clear: () => apiFetch<void>('/api/orders/', { method: 'DELETE' }),
}
