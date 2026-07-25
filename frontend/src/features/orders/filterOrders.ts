import type { Order } from '../../types/domain'

export type OrderFilter = 'all' | 'active' | 'served' | 'cancelled'

export const ORDER_FILTERS: { value: OrderFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'served', label: 'Served' },
  { value: 'cancelled', label: 'Cancelled' },
]

/**
 * Filters orders by status group and a free-text query (order number,
 * customer name, or table label).
 */
export function filterOrders(orders: Order[], filter: OrderFilter, query: string): Order[] {
  let result = orders
  if (filter === 'active') {
    result = result.filter((o) => o.status !== 'served' && o.status !== 'cancelled')
  } else if (filter !== 'all') {
    result = result.filter((o) => o.status === filter)
  }

  const q = query.trim().toLowerCase()
  if (q) {
    result = result.filter(
      (o) =>
        String(o.number).includes(q) ||
        (o.customerName ?? '').toLowerCase().includes(q) ||
        (o.tableLabel ?? '').toLowerCase().includes(q),
    )
  }
  return result
}
