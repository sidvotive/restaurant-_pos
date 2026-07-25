import { describe, expect, it } from 'vitest'
import { splitEvenly } from './splitBill'

describe('splitEvenly', () => {
  it('returns the whole total for 1 (or fewer) ways', () => {
    expect(splitEvenly(73500, 1)).toEqual([73500])
    expect(splitEvenly(73500, 0)).toEqual([73500])
  })

  it('divides evenly when it divides cleanly', () => {
    expect(splitEvenly(90000, 3)).toEqual([30000, 30000, 30000])
  })

  it('spreads the remainder one-per-share and still sums to the total', () => {
    // 73500 / 4 = 18375, remainder 0 → clean; use a remainder case:
    const shares = splitEvenly(10000, 3) // 3333*3 = 9999, remainder 1
    expect(shares).toEqual([3334, 3333, 3333])
    expect(shares.reduce((a, b) => a + b, 0)).toBe(10000)
  })

  it('never produces negative shares', () => {
    expect(splitEvenly(-500, 3)).toEqual([0, 0, 0])
  })
})
