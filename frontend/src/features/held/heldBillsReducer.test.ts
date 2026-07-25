import { describe, expect, it } from 'vitest'
import type { HeldBill } from '../../types/domain'
import { heldBillsReducer, initialHeldBillsState } from './heldBillsReducer'

const bill = (id: string): HeldBill => ({
  id,
  lines: [],
  orderType: 'dine-in',
  discountMinor: 0,
  tipMinor: 0,
  heldAt: '2026-01-01T00:00:00.000Z',
})

describe('heldBillsReducer', () => {
  it('holds a bill at the front (newest first)', () => {
    let state = heldBillsReducer(initialHeldBillsState, { type: 'hold', bill: bill('a') })
    state = heldBillsReducer(state, { type: 'hold', bill: bill('b') })
    expect(state.bills.map((b) => b.id)).toEqual(['b', 'a'])
  })

  it('removes a held bill by id', () => {
    let state = heldBillsReducer(initialHeldBillsState, { type: 'hold', bill: bill('a') })
    state = heldBillsReducer(state, { type: 'hold', bill: bill('b') })
    state = heldBillsReducer(state, { type: 'remove', id: 'a' })
    expect(state.bills.map((b) => b.id)).toEqual(['b'])
  })

  it('is a no-op when removing an unknown id', () => {
    const state = heldBillsReducer({ bills: [bill('a')] }, { type: 'remove', id: 'missing' })
    expect(state.bills.map((b) => b.id)).toEqual(['a'])
  })
})
