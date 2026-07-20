import { describe, expect, it } from 'vitest'
import type { Order } from '../../types/domain'
import {
  initialOrdersState,
  nextStatus,
  ordersReducer,
} from './ordersReducer'

const makeOrder = (id: string, number: number): Order => ({
  id,
  number,
  type: 'dine-in',
  lines: [],
  totalMinor: 10000,
  status: 'placed',
  placedAt: '2026-01-01T00:00:00.000Z',
})

describe('nextStatus', () => {
  it('progresses placed → preparing → ready → served', () => {
    expect(nextStatus('placed')).toBe('preparing')
    expect(nextStatus('preparing')).toBe('ready')
    expect(nextStatus('ready')).toBe('served')
  })

  it('is terminal at served', () => {
    expect(nextStatus('served')).toBe('served')
  })
})

describe('ordersReducer', () => {
  it('places an order at the front (newest first)', () => {
    let state = ordersReducer(initialOrdersState, { type: 'place', order: makeOrder('a', 1) })
    state = ordersReducer(state, { type: 'place', order: makeOrder('b', 2) })
    expect(state.orders.map((o) => o.id)).toEqual(['b', 'a'])
  })

  it('advances the targeted order only', () => {
    let state = ordersReducer(initialOrdersState, { type: 'place', order: makeOrder('a', 1) })
    state = ordersReducer(state, { type: 'place', order: makeOrder('b', 2) })
    state = ordersReducer(state, { type: 'advance', orderId: 'a' })
    expect(state.orders.find((o) => o.id === 'a')?.status).toBe('preparing')
    expect(state.orders.find((o) => o.id === 'b')?.status).toBe('placed')
  })

  it('does not advance past served', () => {
    let state = ordersReducer(initialOrdersState, { type: 'place', order: makeOrder('a', 1) })
    for (let i = 0; i < 5; i++) {
      state = ordersReducer(state, { type: 'advance', orderId: 'a' })
    }
    expect(state.orders[0].status).toBe('served')
  })

  it('is a no-op when advancing an unknown order', () => {
    const state = ordersReducer(
      { orders: [makeOrder('a', 1)] },
      { type: 'advance', orderId: 'missing' },
    )
    expect(state.orders[0].status).toBe('placed')
  })

  it('clears all orders', () => {
    const state = ordersReducer(
      { orders: [makeOrder('a', 1), makeOrder('b', 2)] },
      { type: 'clear' },
    )
    expect(state.orders).toEqual([])
  })
})
