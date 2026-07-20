import { describe, expect, it } from 'vitest'
import { formatMinor, parseAmountToMinor } from './money'

describe('formatMinor', () => {
  it('formats minor units as a rupee currency string', () => {
    const out = formatMinor(28000)
    expect(out).toContain('₹')
    // Normalise any non-breaking spaces the Intl formatter may insert.
    expect(out.replace(/ /g, ' ')).toContain('280.00')
  })

  it('formats zero', () => {
    expect(formatMinor(0)).toContain('0.00')
  })

  it('keeps two decimal places for non-round amounts', () => {
    expect(formatMinor(6050)).toContain('60.50')
  })
})

describe('parseAmountToMinor', () => {
  it('parses whole and decimal amounts to minor units', () => {
    expect(parseAmountToMinor('250')).toBe(25000)
    expect(parseAmountToMinor('250.5')).toBe(25050)
    expect(parseAmountToMinor('250.50')).toBe(25050)
    expect(parseAmountToMinor(' 0 ')).toBe(0)
  })

  it('rejects invalid input', () => {
    expect(parseAmountToMinor('')).toBeNull()
    expect(parseAmountToMinor('abc')).toBeNull()
    expect(parseAmountToMinor('-5')).toBeNull()
    expect(parseAmountToMinor('1.234')).toBeNull()
  })
})
