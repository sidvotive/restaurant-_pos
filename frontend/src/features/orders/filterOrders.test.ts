import { describe, expect, it } from 'vitest'
import type { Order, OrderStatus } from '../../types/domain'
import { filterOrders } from './filterOrders'

let seq = 0
const order = (
  status: OrderStatus,
  over: Partial<Order> = {},
): Order => ({
  id: `o${seq++}`,
  number: seq,
  type: 'dine-in',
  lines: [],
  totalMinor: 1000,
  status,
  placedAt: '2026-01-01T00:00:00.000Z',
  ...over,
})

describe('filterOrders', () => {
  const placed = order('placed', { number: 1, customerName: 'Asha', tableLabel: 'T1' })
  const ready = order('ready', { number: 2 })
  const served = order('served', { number: 3 })
  const cancelled = order('cancelled', { number: 4 })
  const orders = [placed, ready, served, cancelled]

  it('all returns everything', () => {
    expect(filterOrders(orders, 'all', '')).toHaveLength(4)
  })

  it('active excludes served and cancelled', () => {
    expect(filterOrders(orders, 'active', '').map((o) => o.number)).toEqual([1, 2])
  })

  it('filters to a specific status', () => {
    expect(filterOrders(orders, 'cancelled', '').map((o) => o.number)).toEqual([4])
  })

  it('searches by order number', () => {
    expect(filterOrders(orders, 'all', '2').map((o) => o.number)).toEqual([2])
  })

  it('searches by customer name (case-insensitive) and table', () => {
    expect(filterOrders(orders, 'all', 'asha').map((o) => o.number)).toEqual([1])
    expect(filterOrders(orders, 'all', 't1').map((o) => o.number)).toEqual([1])
  })
})
