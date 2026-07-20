// Money is stored and computed in integer minor units (paise/cents) to avoid
// floating-point rounding errors, and only formatted for display.

const CURRENCY = 'INR'
const LOCALE = 'en-IN'

export function formatMinor(minor: number): string {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
  }).format(minor / 100)
}

/**
 * Parses a user-entered major-unit amount (e.g. "280" or "280.50") into integer
 * minor units. Returns null for input that is not a valid non-negative amount.
 */
export function parseAmountToMinor(input: string): number | null {
  const trimmed = input.trim()
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null
  return Math.round(Number.parseFloat(trimmed) * 100)
}
