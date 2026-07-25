import type { Shift } from '../../types/domain'
import { openShiftFor } from './attendance'

export interface AttendanceState {
  shifts: Shift[]
}

export type AttendanceAction =
  | { type: 'clockIn'; shift: Shift }
  | { type: 'clockOut'; employeeId: string; at: string }

export const initialAttendanceState: AttendanceState = { shifts: [] }

export function attendanceReducer(state: AttendanceState, action: AttendanceAction): AttendanceState {
  switch (action.type) {
    case 'clockIn':
      // Ignore a second clock-in while already clocked in.
      if (openShiftFor(state.shifts, action.shift.employeeId)) return state
      return { shifts: [action.shift, ...state.shifts] }
    case 'clockOut':
      return {
        shifts: state.shifts.map((s) =>
          s.employeeId === action.employeeId && !s.clockOutAt
            ? { ...s, clockOutAt: action.at }
            : s,
        ),
      }
    default:
      return state
  }
}
