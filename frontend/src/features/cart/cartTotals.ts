import type { BillTotals, CartLine } from '../../types/domain'

// Placeholder tax rate. Real tax/GST is tenant/branch-configurable (issue #7).
export const TAX_RATE = 0.05

export function lineTotalMinor(line: CartLine): number {
  return line.product.priceMinor * line.quantity
}

export interface BillAdjustments {
  /** Requested discount in minor units (clamped to the subtotal). */
  discountMinor?: number
  /** Gratuity in minor units. */
  tipMinor?: number
}

/**
 * Bill math (all integer minor units):
 *   discount = min(requested, subtotal)
 *   tax      = round((subtotal − discount) × rate)
 *   total    = (subtotal − discount) + tax + tip
 */
export function computeTotals(lines: CartLine[], adjustments: BillAdjustments = {}): BillTotals {
  const subtotalMinor = lines.reduce((sum, line) => sum + lineTotalMinor(line), 0)

  const requestedDiscount = Math.max(0, Math.round(adjustments.discountMinor ?? 0))
  const discountMinor = Math.min(requestedDiscount, subtotalMinor)
  const tipMinor = Math.max(0, Math.round(adjustments.tipMinor ?? 0))

  const taxableMinor = subtotalMinor - discountMinor
  const taxMinor = Math.round(taxableMinor * TAX_RATE)

  return {
    subtotalMinor,
    discountMinor,
    taxMinor,
    tipMinor,
    totalMinor: taxableMinor + taxMinor + tipMinor,
  }
}
