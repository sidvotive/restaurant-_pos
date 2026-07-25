/**
 * Splits a total into `ways` integer shares that sum exactly to the total.
 * The remainder (in minor units) is spread one-per-share across the first
 * shares, so shares differ by at most one minor unit.
 */
export function splitEvenly(totalMinor: number, ways: number): number[] {
  const total = Math.max(0, totalMinor)
  if (ways <= 1) return [total]
  const base = Math.floor(total / ways)
  const remainder = total - base * ways
  return Array.from({ length: ways }, (_, i) => base + (i < remainder ? 1 : 0))
}
