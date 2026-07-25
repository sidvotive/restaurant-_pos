import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { Expense } from '../../types/domain'
import { loadJson, saveJson } from '../../lib/persist'
import { expensesReducer, initialExpensesState, type ExpensesState } from './expensesReducer'

const STORAGE_KEY = 'rpos.expenses'

interface ExpensesContextValue {
  expenses: Expense[]
  add: (label: string, amountMinor: number) => void
  remove: (id: string) => void
}

const ExpensesContext = createContext<ExpensesContextValue | null>(null)

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)
}

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    expensesReducer,
    initialExpensesState,
    (init): ExpensesState => loadJson<ExpensesState>(STORAGE_KEY, init),
  )

  useEffect(() => {
    saveJson(STORAGE_KEY, state)
  }, [state])

  const value = useMemo<ExpensesContextValue>(
    () => ({
      expenses: state.expenses,
      add: (label, amountMinor) =>
        dispatch({
          type: 'add',
          expense: { id: newId(), label: label.trim(), amountMinor, at: new Date().toISOString() },
        }),
      remove: (id) => dispatch({ type: 'remove', id }),
    }),
    [state],
  )

  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useExpenses(): ExpensesContextValue {
  const ctx = useContext(ExpensesContext)
  if (!ctx) throw new Error('useExpenses must be used within an ExpensesProvider')
  return ctx
}
