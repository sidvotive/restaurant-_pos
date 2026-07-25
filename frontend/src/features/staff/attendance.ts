import type { Shift } from '../../types/domain'

/** The employee's currently-open shift, if they are clocked in. */
export function openShiftFor(shifts: Shift[], employeeId: string): Shift | undefined {
  return shifts.find((s) => s.employeeId === employeeId && !s.clockOutAt)
}

/**
 * Total minutes worked by an employee across their shifts. An open shift
 * counts up to `nowMs`.
 */
export function workedMinutes(shifts: Shift[], employeeId: string, nowMs: number): number {
  return shifts
    .filter((s) => s.employeeId === employeeId)
    .reduce((sum, s) => {
      const start = Date.parse(s.clockInAt)
      const end = s.clockOutAt ? Date.parse(s.clockOutAt) : nowMs
      return sum + Math.max(0, Math.floor((end - start) / 60_000))
    }, 0)
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}
