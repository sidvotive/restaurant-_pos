// Coupons compute a discount from the subtotal; applying one sets the cart's
// discount. A tenant-configurable catalog is future work — this is a fixed set.

interface Coupon {
  code: string
  kind: 'percent' | 'flat'
  /** percent: whole percent (10 = 10%); flat: minor units. */
  value: number
  label: string
}

export const COUPONS: Coupon[] = [
  { code: 'WELCOME10', kind: 'percent', value: 10, label: '10% off' },
  { code: 'SAVE20', kind: 'percent', value: 20, label: '20% off' },
  { code: 'FLAT50', kind: 'flat', value: 5000, label: '₹50 off' },
]

export type CouponResult =
  | { ok: true; discountMinor: number; label: string }
  | { ok: false; error: string }

export function applyCoupon(code: string, subtotalMinor: number): CouponResult {
  const coupon = COUPONS.find((c) => c.code === code.trim().toUpperCase())
  if (!coupon) return { ok: false, error: 'Invalid coupon code.' }
  if (subtotalMinor <= 0) return { ok: false, error: 'Add items before applying a coupon.' }

  const raw = coupon.kind === 'percent' ? Math.round((subtotalMinor * coupon.value) / 100) : coupon.value
  return { ok: true, discountMinor: Math.min(raw, subtotalMinor), label: coupon.label }
}
