import { describe, expect, it } from 'vitest'
import { applyCoupon } from './coupons'

describe('applyCoupon', () => {
  it('applies a percentage coupon', () => {
    // 10% of ₹500.00
    const r = applyCoupon('WELCOME10', 50000)
    expect(r).toEqual({ ok: true, discountMinor: 5000, label: '10% off' })
  })

  it('is case-insensitive and trims', () => {
    expect(applyCoupon('  welcome10 ', 50000)).toMatchObject({ ok: true, discountMinor: 5000 })
  })

  it('applies a flat coupon, clamped to the subtotal', () => {
    expect(applyCoupon('FLAT50', 50000)).toMatchObject({ ok: true, discountMinor: 5000 })
    // FLAT50 (₹50) on a ₹30 subtotal clamps to ₹30
    expect(applyCoupon('FLAT50', 3000)).toMatchObject({ ok: true, discountMinor: 3000 })
  })

  it('rejects an unknown code', () => {
    expect(applyCoupon('NOPE', 50000)).toEqual({ ok: false, error: 'Invalid coupon code.' })
  })

  it('rejects an empty cart', () => {
    const r = applyCoupon('WELCOME10', 0)
    expect(r.ok).toBe(false)
  })
})
