import { describe, expect, it } from 'vitest'
import type { Order, OrderType } from '../../types/domain'
import { filterByRange } from './dateRange'

const DAY = 24 * 60 * 60 * 1000
const NOW = Date.parse('2026-06-15T12:00:00.000Z')

let seq = 0
const orderAt = (offsetMs: number, type: OrderType = 'dine-in'): Order => ({
  id: `o${seq++}`,
  number: seq,
  type,
  lines: [],
  totalMinor: 1000,
  status: 'placed',
  placedAt: new Date(NOW + offsetMs).toISOString(),
})

describe('filterByRange', () => {
  const today = orderAt(0)
  const yesterday = orderAt(-1 * DAY)
  const tenDaysAgo = orderAt(-10 * DAY)
  const orders = [today, yesterday, tenDaysAgo]

  it('all returns everything', () => {
    expect(filterByRange(orders, 'all', NOW)).toHaveLength(3)
  })

  it('today returns only orders from the current day', () => {
    expect(filterByRange(orders, 'today', NOW).map((o) => o.id)).toEqual([today.id])
  })

  it('week returns orders within the last 7 days', () => {
    expect(filterByRange(orders, 'week', NOW).map((o) => o.id)).toEqual([today.id, yesterday.id])
  })
})
