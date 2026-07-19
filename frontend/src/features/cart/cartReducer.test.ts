import { describe, expect, it } from 'vitest'
import type { Product } from '../../types/domain'
import { cartReducer, initialCartState } from './cartReducer'

const paneer: Product = { id: 'p1', categoryId: 'starters', name: 'Paneer Tikka', priceMinor: 28000 }
const naan: Product = { id: 'p6', categoryId: 'breads', name: 'Butter Naan', priceMinor: 8000 }

describe('cartReducer', () => {
  it('adds a new product as a line with quantity 1', () => {
    const state = cartReducer(initialCartState, { type: 'add', product: paneer })
    expect(state.lines).toHaveLength(1)
    expect(state.lines[0]).toEqual({ product: paneer, quantity: 1 })
  })

  it('increments quantity when adding an existing product (no duplicate line)', () => {
    let state = cartReducer(initialCartState, { type: 'add', product: paneer })
    state = cartReducer(state, { type: 'add', product: paneer })
    expect(state.lines).toHaveLength(1)
    expect(state.lines[0].quantity).toBe(2)
  })

  it('keeps distinct products on separate lines', () => {
    let state = cartReducer(initialCartState, { type: 'add', product: paneer })
    state = cartReducer(state, { type: 'add', product: naan })
    expect(state.lines.map((l) => l.product.id)).toEqual(['p1', 'p6'])
  })

  it('decrements quantity and drops the line when it hits zero', () => {
    let state = cartReducer(initialCartState, { type: 'add', product: paneer })
    state = cartReducer(state, { type: 'add', product: paneer })
    state = cartReducer(state, { type: 'decrement', productId: 'p1' })
    expect(state.lines[0].quantity).toBe(1)
    state = cartReducer(state, { type: 'decrement', productId: 'p1' })
    expect(state.lines).toHaveLength(0)
  })

  it('removes a line outright regardless of quantity', () => {
    let state = cartReducer(initialCartState, { type: 'add', product: paneer })
    state = cartReducer(state, { type: 'add', product: paneer })
    state = cartReducer(state, { type: 'remove', productId: 'p1' })
    expect(state.lines).toHaveLength(0)
  })

  it('clears all lines but preserves order type', () => {
    let state = cartReducer(initialCartState, { type: 'setOrderType', orderType: 'takeaway' })
    state = cartReducer(state, { type: 'add', product: paneer })
    state = cartReducer(state, { type: 'clear' })
    expect(state.lines).toHaveLength(0)
    expect(state.orderType).toBe('takeaway')
  })

  it('sets the order type', () => {
    const state = cartReducer(initialCartState, { type: 'setOrderType', orderType: 'delivery' })
    expect(state.orderType).toBe('delivery')
  })

  it('treats state as immutable (does not mutate the input)', () => {
    const before = cartReducer(initialCartState, { type: 'add', product: paneer })
    const snapshot = JSON.parse(JSON.stringify(before))
    cartReducer(before, { type: 'add', product: paneer })
    expect(before).toEqual(snapshot)
  })
})
