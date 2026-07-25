import type { Order } from '../../types/domain'

export interface CustomerRow {
  /** Grouping key: phone if present, else the lowercased name. */
  key: string
  name: string
  phone?: string
  visits: number
  totalSpentMinor: number
  lastOrderAt: string
}

/**
 * Derives a customer list from orders that carry customer details. Orders are
 * grouped by phone when available, otherwise by name. Sorted by total spend.
 */
export function summarizeCustomers(orders: Order[]): CustomerRow[] {
  const byKey = new Map<string, CustomerRow>()

  for (const order of orders) {
    const name = order.customerName?.trim()
    const phone = order.customerPhone?.trim()
    if (!name && !phone) continue

    const key = phone || (name ?? '').toLowerCase()
    const existing = byKey.get(key)
    if (existing) {
      existing.visits += 1
      existing.totalSpentMinor += order.totalMinor
      if (order.placedAt > existing.lastOrderAt) existing.lastOrderAt = order.placedAt
      if (!existing.name && name) existing.name = name
    } else {
      byKey.set(key, {
        key,
        name: name || phone || 'Guest',
        phone,
        visits: 1,
        totalSpentMinor: order.totalMinor,
        lastOrderAt: order.placedAt,
      })
    }
  }

  return [...byKey.values()].sort((a, b) => b.totalSpentMinor - a.totalSpentMinor)
}
