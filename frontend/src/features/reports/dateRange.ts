import type { Order } from '../../types/domain'

export type DateRange = 'today' | 'week' | 'all'

export const DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: '7 days' },
  { value: 'all', label: 'All' },
]

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/** Filters orders to those placed within the given range relative to `nowMs`. */
export function filterByRange(orders: Order[], range: DateRange, nowMs: number): Order[] {
  if (range === 'all') return orders
  if (range === 'today') {
    const now = new Date(nowMs)
    return orders.filter((o) => isSameDay(new Date(o.placedAt), now))
  }
  const cutoff = nowMs - 7 * 24 * 60 * 60 * 1000
  return orders.filter((o) => Date.parse(o.placedAt) >= cutoff)
}
