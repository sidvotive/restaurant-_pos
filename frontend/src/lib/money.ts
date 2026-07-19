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
