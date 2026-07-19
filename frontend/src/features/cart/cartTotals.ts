import type { BillTotals, CartLine } from '../../types/domain'

// Placeholder tax rate. Real tax/GST is tenant/branch-configurable (issue #7).
export const TAX_RATE = 0.05

export function lineTotalMinor(line: CartLine): number {
  return line.product.priceMinor * line.quantity
}

export function computeTotals(lines: CartLine[]): BillTotals {
  const subtotalMinor = lines.reduce((sum, line) => sum + lineTotalMinor(line), 0)
  const taxMinor = Math.round(subtotalMinor * TAX_RATE)
  return {
    subtotalMinor,
    taxMinor,
    totalMinor: subtotalMinor + taxMinor,
  }
}
