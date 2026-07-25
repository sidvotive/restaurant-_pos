import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { Employee, Shift } from '../../types/domain'
import { loadJson, saveJson } from '../../lib/persist'
import {
  attendanceReducer,
  initialAttendanceState,
  type AttendanceState,
} from './attendanceReducer'
import { mockEmployees } from './mockEmployees'

const STORAGE_KEY = 'rpos.attendance'

interface StaffContextValue {
  employees: Employee[]
  shifts: Shift[]
  clockIn: (employeeId: string) => void
  clockOut: (employeeId: string) => void
}

const StaffContext = createContext<StaffContextValue | null>(null)

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)
}

export function StaffProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    attendanceReducer,
    initialAttendanceState,
    (init): AttendanceState => loadJson<AttendanceState>(STORAGE_KEY, init),
  )

  useEffect(() => {
    saveJson(STORAGE_KEY, state)
  }, [state])

  const value = useMemo<StaffContextValue>(
    () => ({
      employees: mockEmployees,
      shifts: state.shifts,
      clockIn: (employeeId) =>
        dispatch({
          type: 'clockIn',
          shift: { id: newId(), employeeId, clockInAt: new Date().toISOString() },
        }),
      clockOut: (employeeId) =>
        dispatch({ type: 'clockOut', employeeId, at: new Date().toISOString() }),
    }),
    [state],
  )

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStaff(): StaffContextValue {
  const ctx = useContext(StaffContext)
  if (!ctx) throw new Error('useStaff must be used within a StaffProvider')
  return ctx
}
