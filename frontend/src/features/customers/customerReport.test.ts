import { describe, expect, it } from 'vitest'
import type { Order, OrderType } from '../../types/domain'
import { summarizeCustomers } from './customerReport'

let seq = 0
const order = (
  totalMinor: number,
  customer: { customerName?: string; customerPhone?: string },
  placedAt = '2026-01-01T00:00:00.000Z',
  type: OrderType = 'takeaway',
): Order => ({
  id: `o${seq++}`,
  number: seq,
  type,
  lines: [],
  totalMinor,
  status: 'placed',
  placedAt,
  ...customer,
})

describe('summarizeCustomers', () => {
  it('ignores orders with no customer details', () => {
    expect(summarizeCustomers([order(1000, {})])).toEqual([])
  })

  it('groups by phone, summing visits and spend', () => {
    const rows = summarizeCustomers([
      order(30000, { customerName: 'Asha', customerPhone: '99999' }, '2026-01-01T10:00:00.000Z'),
      order(20000, { customerName: 'Asha R', customerPhone: '99999' }, '2026-01-02T10:00:00.000Z'),
    ])
    expect(rows).toHaveLength(1)
    expect(rows[0].visits).toBe(2)
    expect(rows[0].totalSpentMinor).toBe(50000)
    expect(rows[0].phone).toBe('99999')
    expect(rows[0].lastOrderAt).toBe('2026-01-02T10:00:00.000Z')
  })

  it('groups by name when no phone is given', () => {
    const rows = summarizeCustomers([
      order(10000, { customerName: 'Bob' }),
      order(15000, { customerName: 'bob' }), // case-insensitive
    ])
    expect(rows).toHaveLength(1)
    expect(rows[0].visits).toBe(2)
    expect(rows[0].totalSpentMinor).toBe(25000)
  })

  it('sorts by total spend descending', () => {
    const rows = summarizeCustomers([
      order(10000, { customerPhone: '111' }),
      order(50000, { customerPhone: '222' }),
      order(30000, { customerPhone: '333' }),
    ])
    expect(rows.map((r) => r.phone)).toEqual(['222', '333', '111'])
  })
})
