import { describe, expect, it } from 'vitest'
import type { Category, Product } from '../../types/domain'
import { menuReducer, type MenuState } from './menuReducer'

const cat = (id: string, name: string): Category => ({ id, name })
const prod = (id: string, categoryId: string): Product => ({
  id,
  categoryId,
  name: id,
  priceMinor: 1000,
})

const base = (): MenuState => ({
  categories: [cat('c1', 'Starters'), cat('c2', 'Mains')],
  products: [prod('p1', 'c1'), prod('p2', 'c1'), prod('p3', 'c2')],
})

describe('menuReducer categories', () => {
  it('adds a category', () => {
    const state = menuReducer(base(), { type: 'addCategory', category: cat('c3', 'Drinks') })
    expect(state.categories.map((c) => c.id)).toEqual(['c1', 'c2', 'c3'])
  })

  it('renames a category', () => {
    const state = menuReducer(base(), { type: 'renameCategory', id: 'c1', name: 'Appetisers' })
    expect(state.categories.find((c) => c.id === 'c1')?.name).toBe('Appetisers')
  })

  it('removing a category also removes its products', () => {
    const state = menuReducer(base(), { type: 'removeCategory', id: 'c1' })
    expect(state.categories.map((c) => c.id)).toEqual(['c2'])
    expect(state.products.map((p) => p.id)).toEqual(['p3'])
  })
})

describe('menuReducer products', () => {
  it('adds a product', () => {
    const state = menuReducer(base(), { type: 'addProduct', product: prod('p4', 'c2') })
    expect(state.products.map((p) => p.id)).toContain('p4')
  })

  it('updates a product in place', () => {
    const updated: Product = { id: 'p1', categoryId: 'c1', name: 'Renamed', priceMinor: 5000 }
    const state = menuReducer(base(), { type: 'updateProduct', product: updated })
    const p1 = state.products.find((p) => p.id === 'p1')
    expect(p1).toEqual(updated)
  })

  it('removes a product', () => {
    const state = menuReducer(base(), { type: 'removeProduct', id: 'p2' })
    expect(state.products.map((p) => p.id)).toEqual(['p1', 'p3'])
  })
})
