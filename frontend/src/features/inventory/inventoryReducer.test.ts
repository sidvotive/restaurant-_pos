import { describe, expect, it } from 'vitest'
import type { CartLine, Product } from '../../types/domain'
import { inventoryReducer, initialInventoryState } from './inventoryReducer'
import { LOW_STOCK_THRESHOLD, lowStockItems } from './lowStock'

const product = (id: string): Product => ({ id, categoryId: 'c', name: id, priceMinor: 100 })
const line = (id: string, quantity: number): CartLine => ({ product: product(id), quantity })

describe('inventoryReducer', () => {
  it('sets stock, rounding and flooring at zero', () => {
    let state = inventoryReducer(initialInventoryState, { type: 'setStock', productId: 'a', quantity: 12 })
    expect(state.stock.a).toBe(12)
    state = inventoryReducer(state, { type: 'setStock', productId: 'a', quantity: -3 })
    expect(state.stock.a).toBe(0)
  })

  it('decrements tracked products for an order, not below zero', () => {
    let state = inventoryReducer(initialInventoryState, { type: 'setStock', productId: 'a', quantity: 5 })
    state = inventoryReducer(state, { type: 'decrementForOrder', lines: [line('a', 2)] })
    expect(state.stock.a).toBe(3)
    state = inventoryReducer(state, { type: 'decrementForOrder', lines: [line('a', 10)] })
    expect(state.stock.a).toBe(0)
  })

  it('ignores untracked products on decrement', () => {
    const state = inventoryReducer(
      { stock: { a: 5 } },
      { type: 'decrementForOrder', lines: [line('a', 1), line('b', 3)] },
    )
    expect(state.stock.a).toBe(4)
    expect('b' in state.stock).toBe(false)
  })
})

describe('lowStockItems', () => {
  it('returns tracked products at or below the threshold', () => {
    const products = [product('a'), product('b'), product('c')]
    const stock = { a: LOW_STOCK_THRESHOLD, b: LOW_STOCK_THRESHOLD + 1 } // c untracked
    const low = lowStockItems(products, stock)
    expect(low.map((i) => i.product.id)).toEqual(['a'])
  })
})
