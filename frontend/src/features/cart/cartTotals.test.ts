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
    expect(computeTotals([])).toEqual({
      subtotalMinor: 0,
      discountMinor: 0,
      taxMinor: 0,
      tipMinor: 0,
      totalMinor: 0,
    })
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

  it('applies a discount before tax and adds the tip after', () => {
    // subtotal 700.00; discount 100.00 → taxable 600.00; tax 30.00; tip 50.00
    // total = 600 + 30 + 50 = 680.00
    const totals = computeTotals([line(28000, 1), line(42000, 1)], {
      discountMinor: 10000,
      tipMinor: 5000,
    })
    expect(totals.subtotalMinor).toBe(70000)
    expect(totals.discountMinor).toBe(10000)
    expect(totals.taxMinor).toBe(3000)
    expect(totals.tipMinor).toBe(5000)
    expect(totals.totalMinor).toBe(68000)
  })

  it('clamps a discount to the subtotal and never goes negative', () => {
    const totals = computeTotals([line(10000, 1)], { discountMinor: 999999 })
    expect(totals.discountMinor).toBe(10000)
    expect(totals.taxMinor).toBe(0)
    expect(totals.totalMinor).toBe(0)
  })

  it('ignores negative discount/tip inputs', () => {
    const totals = computeTotals([line(10000, 1)], { discountMinor: -500, tipMinor: -500 })
    expect(totals.discountMinor).toBe(0)
    expect(totals.tipMinor).toBe(0)
    expect(totals.totalMinor).toBe(10500)
  })
})
