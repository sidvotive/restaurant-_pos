// Loyalty: customers earn 1 point per ₹10 spent (configurable rate).
// Real programs are tenant-configurable (CRM module); this is a simple default.

/** Minor units of spend that earn one loyalty point (₹10 = 1000 paise). */
export const MINOR_PER_POINT = 1000

export function loyaltyPoints(totalSpentMinor: number): number {
  if (totalSpentMinor <= 0) return 0
  return Math.floor(totalSpentMinor / MINOR_PER_POINT)
}
