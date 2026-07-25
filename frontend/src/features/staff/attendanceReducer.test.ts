import { describe, expect, it } from 'vitest'
import type { Shift } from '../../types/domain'
import { attendanceReducer, initialAttendanceState } from './attendanceReducer'
import { openShiftFor, workedMinutes, formatDuration } from './attendance'

const shift = (id: string, employeeId: string, clockInAt: string): Shift => ({
  id,
  employeeId,
  clockInAt,
})

describe('attendanceReducer', () => {
  it('clocks an employee in, opening a shift', () => {
    const state = attendanceReducer(initialAttendanceState, {
      type: 'clockIn',
      shift: shift('s1', 'e1', '2026-01-01T09:00:00.000Z'),
    })
    expect(state.shifts).toHaveLength(1)
    expect(openShiftFor(state.shifts, 'e1')?.id).toBe('s1')
  })

  it('ignores a second clock-in while already clocked in', () => {
    let state = attendanceReducer(initialAttendanceState, {
      type: 'clockIn',
      shift: shift('s1', 'e1', '2026-01-01T09:00:00.000Z'),
    })
    state = attendanceReducer(state, {
      type: 'clockIn',
      shift: shift('s2', 'e1', '2026-01-01T09:05:00.000Z'),
    })
    expect(state.shifts).toHaveLength(1)
  })

  it('clocks out, closing the open shift', () => {
    let state = attendanceReducer(initialAttendanceState, {
      type: 'clockIn',
      shift: shift('s1', 'e1', '2026-01-01T09:00:00.000Z'),
    })
    state = attendanceReducer(state, { type: 'clockOut', employeeId: 'e1', at: '2026-01-01T11:30:00.000Z' })
    expect(openShiftFor(state.shifts, 'e1')).toBeUndefined()
    expect(state.shifts[0].clockOutAt).toBe('2026-01-01T11:30:00.000Z')
  })
})

describe('workedMinutes', () => {
  it('sums closed shifts and counts an open shift up to now', () => {
    const shifts: Shift[] = [
      { id: 's1', employeeId: 'e1', clockInAt: '2026-01-01T09:00:00.000Z', clockOutAt: '2026-01-01T10:00:00.000Z' },
      { id: 's2', employeeId: 'e1', clockInAt: '2026-01-01T11:00:00.000Z' }, // open
    ]
    const now = Date.parse('2026-01-01T11:30:00.000Z')
    expect(workedMinutes(shifts, 'e1', now)).toBe(90) // 60 + 30
  })
})

describe('formatDuration', () => {
  it('formats hours and minutes', () => {
    expect(formatDuration(90)).toBe('1h 30m')
    expect(formatDuration(45)).toBe('45m')
  })
})
