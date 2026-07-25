import { describe, expect, it } from 'vitest'
import type { Order } from '../../types/domain'
import { ordersToCsv } from './exportCsv'

const baseOrder = (over: Partial<Order>): Order => ({
  id: 'o1',
  number: 1,
  type: 'dine-in',
  lines: [],
  totalMinor: 29400,
  subtotalMinor: 28000,
  discountMinor: 0,
  taxMinor: 1400,
  tipMinor: 0,
  status: 'placed',
  placedAt: '2026-01-01T10:00:00.000Z',
  ...over,
})

describe('ordersToCsv', () => {
  it('starts with the header row', () => {
    const csv = ordersToCsv([])
    expect(csv.split('\n')[0]).toBe(
      'Order,Placed At,Type,Table,Payment,Customer,Subtotal,Discount,Tax,Tip,Total',
    )
  })

  it('formats amounts as major units with two decimals', () => {
    const csv = ordersToCsv([baseOrder({ paymentMethod: 'upi', tableLabel: 'T1' })])
    const row = csv.split('\n')[1]
    expect(row).toBe('1,2026-01-01T10:00:00.000Z,dine-in,T1,upi,,280.00,0.00,14.00,0.00,294.00')
  })

  it('quotes fields containing commas', () => {
    const csv = ordersToCsv([baseOrder({ customerName: 'Doe, John' })])
    expect(csv.split('\n')[1]).toContain('"Doe, John"')
  })
})
