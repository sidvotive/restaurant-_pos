import { describe, expect, it } from 'vitest'
import { formatMinor } from './money'

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
