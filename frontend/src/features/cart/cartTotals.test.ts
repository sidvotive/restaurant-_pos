import { describe, expect, it } from 'vitest'
import type { CartLine, Product } from '../../types/domain'
import { TAX_RATE, computeTotals, lineTotalMinor } from './cartTotals'

const product = (id: string, priceMinor: number): Product => ({
  id,
  categoryId: 'c',
  name: id,
  priceMinor,
})

const line = (priceMinor: number, quantity: number): CartLine => ({
  product: product(`p${priceMinor}`, priceMinor),
  quantity,
})

describe('lineTotalMinor', () => {
  it('multiplies price by quantity', () => {
    expect(lineTotalMinor(line(28000, 3))).toBe(84000)
  })
})

describe('computeTotals', () => {
  it('returns zeros for an empty cart', () => {
    expect(computeTotals([])).toEqual({ subtotalMinor: 0, taxMinor: 0, totalMinor: 0 })
  })

  it('sums lines, applies tax, and totals correctly', () => {
    // 280.00 + 420.00 = 700.00 subtotal; 5% tax = 35.00; total 735.00
    const totals = computeTotals([line(28000, 1), line(42000, 1)])
    expect(totals.subtotalMinor).toBe(70000)
    expect(totals.taxMinor).toBe(3500)
    expect(totals.totalMinor).toBe(73500)
  })

  it('accounts for quantity in the subtotal', () => {
    const totals = computeTotals([line(9000, 2), line(6000, 1)])
    expect(totals.subtotalMinor).toBe(24000)
    expect(totals.totalMinor).toBe(24000 + Math.round(24000 * TAX_RATE))
  })

  it('rounds tax to the nearest minor unit (no fractional paise)', () => {
    // 333 * 0.05 = 16.65 → rounds to 17
    const totals = computeTotals([line(333, 1)])
    expect(totals.taxMinor).toBe(17)
    expect(totals.totalMinor).toBe(350)
    expect(Number.isInteger(totals.taxMinor)).toBe(true)
  })
})
