import { describe, expect, it } from 'vitest'
import { loyaltyPoints } from './loyalty'

describe('loyaltyPoints', () => {
  it('earns 1 point per ₹10 spent, floored', () => {
    expect(loyaltyPoints(1000)).toBe(1) // ₹10
    expect(loyaltyPoints(29400)).toBe(29) // ₹294.00 → 29 points
    expect(loyaltyPoints(999)).toBe(0) // under ₹10
  })

  it('is zero for zero or negative spend', () => {
    expect(loyaltyPoints(0)).toBe(0)
    expect(loyaltyPoints(-500)).toBe(0)
  })
})
