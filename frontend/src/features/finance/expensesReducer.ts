import type { Expense } from '../../types/domain'

export interface ExpensesState {
  expenses: Expense[]
}

export type ExpensesAction =
  | { type: 'add'; expense: Expense }
  | { type: 'remove'; id: string }

export const initialExpensesState: ExpensesState = { expenses: [] }

export function expensesReducer(state: ExpensesState, action: ExpensesAction): ExpensesState {
  switch (action.type) {
    case 'add':
      return { expenses: [action.expense, ...state.expenses] } // newest first
    case 'remove':
      return { expenses: state.expenses.filter((e) => e.id !== action.id) }
    default:
      return state
  }
}

export function totalExpensesMinor(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amountMinor, 0)
}
