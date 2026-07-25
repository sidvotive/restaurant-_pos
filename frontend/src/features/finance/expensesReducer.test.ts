import { describe, expect, it } from 'vitest'
import type { Expense } from '../../types/domain'
import {
  expensesReducer,
  initialExpensesState,
  totalExpensesMinor,
} from './expensesReducer'

const expense = (id: string, amountMinor: number): Expense => ({
  id,
  label: id,
  amountMinor,
  at: '2026-01-01T00:00:00.000Z',
})

describe('expensesReducer', () => {
  it('adds an expense at the front (newest first)', () => {
    let state = expensesReducer(initialExpensesState, { type: 'add', expense: expense('a', 1000) })
    state = expensesReducer(state, { type: 'add', expense: expense('b', 2000) })
    expect(state.expenses.map((e) => e.id)).toEqual(['b', 'a'])
  })

  it('removes an expense by id', () => {
    let state = expensesReducer({ expenses: [expense('a', 1000), expense('b', 2000)] }, {
      type: 'remove',
      id: 'a',
    })
    expect(state.expenses.map((e) => e.id)).toEqual(['b'])
    state = expensesReducer(state, { type: 'remove', id: 'missing' })
    expect(state.expenses.map((e) => e.id)).toEqual(['b'])
  })
})

describe('totalExpensesMinor', () => {
  it('sums expense amounts', () => {
    expect(totalExpensesMinor([])).toBe(0)
    expect(totalExpensesMinor([expense('a', 1000), expense('b', 2500)])).toBe(3500)
  })
})
