import { describe, expect, it } from 'vitest'
import type { Order, OrderType, Product } from '../../types/domain'
import { salesByPayment, salesByType, summarizeSales, topItems } from './salesReport'

const product = (name: string, priceMinor: number): Product => ({
  id: name,
  categoryId: 'c',
  name,
  priceMinor,
})

let seq = 0
const order = (
  type: OrderType,
  totalMinor: number,
  lines: { product: Product; quantity: number }[] = [],
): Order => ({
  id: `o${seq++}`,
  number: seq,
  type,
  lines,
  totalMinor,
  status: 'placed',
  placedAt: '2026-01-01T00:00:00.000Z',
})

describe('summarizeSales', () => {
  it('returns zeros for no orders', () => {
    expect(summarizeSales([])).toEqual({
      orderCount: 0,
      totalSalesMinor: 0,
      averageOrderMinor: 0,
      itemCount: 0,
    })
  })

  it('totals sales, counts items, and averages per order', () => {
    const paneer = product('Paneer', 28000)
    const naan = product('Naan', 8000)
    const orders = [
      order('dine-in', 30000, [{ product: paneer, quantity: 1 }]),
      order('takeaway', 10000, [{ product: naan, quantity: 2 }]),
    ]
    const s = summarizeSales(orders)
    expect(s.orderCount).toBe(2)
    expect(s.totalSalesMinor).toBe(40000)
    expect(s.averageOrderMinor).toBe(20000)
    expect(s.itemCount).toBe(3)
  })
})

describe('salesByType', () => {
  it('groups by type in fixed order including zeros', () => {
    const rows = salesByType([order('dine-in', 30000), order('dine-in', 20000)])
    expect(rows.map((r) => r.type)).toEqual(['dine-in', 'takeaway', 'delivery'])
    expect(rows[0]).toEqual({ type: 'dine-in', count: 2, salesMinor: 50000 })
    expect(rows[1]).toEqual({ type: 'takeaway', count: 0, salesMinor: 0 })
  })
})

describe('salesByPayment', () => {
  it('groups by method in fixed order, defaulting missing to cash', () => {
    const orders = [
      { ...order('dine-in', 30000), paymentMethod: 'card' as const },
      { ...order('takeaway', 10000), paymentMethod: 'upi' as const },
      order('delivery', 5000), // no paymentMethod → counts as cash
    ]
    const rows = salesByPayment(orders)
    expect(rows.map((r) => r.method)).toEqual(['cash', 'card', 'upi', 'qr'])
    expect(rows[0]).toEqual({ method: 'cash', count: 1, salesMinor: 5000 })
    expect(rows[1]).toEqual({ method: 'card', count: 1, salesMinor: 30000 })
    expect(rows[3]).toEqual({ method: 'qr', count: 0, salesMinor: 0 })
  })
})

describe('topItems', () => {
  it('ranks items by quantity then revenue, respecting the limit', () => {
    const paneer = product('Paneer', 28000)
    const naan = product('Naan', 8000)
    const orders = [
      order('dine-in', 0, [{ product: paneer, quantity: 1 }, { product: naan, quantity: 2 }]),
      order('takeaway', 0, [{ product: naan, quantity: 3 }]),
    ]
    const top = topItems(orders, 5)
    expect(top[0]).toEqual({ name: 'Naan', quantity: 5, salesMinor: 40000 })
    expect(top[1]).toEqual({ name: 'Paneer', quantity: 1, salesMinor: 28000 })
  })

  it('respects the limit', () => {
    const orders = [
      order('dine-in', 0, [
        { product: product('A', 100), quantity: 3 },
        { product: product('B', 100), quantity: 2 },
        { product: product('C', 100), quantity: 1 },
      ]),
    ]
    expect(topItems(orders, 2).map((r) => r.name)).toEqual(['A', 'B'])
  })
})
