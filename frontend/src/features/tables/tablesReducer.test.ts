import { describe, expect, it } from 'vitest'
import type { RestaurantTable } from '../../types/domain'
import { groupByArea, summarize, tablesReducer, type TablesState } from './tablesReducer'

const table = (id: string, area: string, status: RestaurantTable['status']): RestaurantTable => ({
  id,
  label: id.toUpperCase(),
  area,
  seats: 4,
  status,
})

const baseState = (): TablesState => ({
  tables: [
    table('t1', 'Ground Floor', 'free'),
    table('t2', 'Ground Floor', 'reserved'),
    table('t3', 'Terrace', 'free'),
  ],
  selectedTableId: null,
})

describe('tablesReducer', () => {
  it('selects and clears a table', () => {
    let state = tablesReducer(baseState(), { type: 'select', tableId: 't1' })
    expect(state.selectedTableId).toBe('t1')
    state = tablesReducer(state, { type: 'select', tableId: null })
    expect(state.selectedTableId).toBeNull()
  })

  it('changes a table status', () => {
    const state = tablesReducer(baseState(), {
      type: 'setStatus',
      tableId: 't1',
      status: 'occupied',
    })
    expect(state.tables.find((t) => t.id === 't1')?.status).toBe('occupied')
  })

  it('deselects a table when it becomes non-free', () => {
    let state = tablesReducer(baseState(), { type: 'select', tableId: 't1' })
    state = tablesReducer(state, { type: 'setStatus', tableId: 't1', status: 'occupied' })
    expect(state.selectedTableId).toBeNull()
  })

  it('keeps the selection when a different table changes status', () => {
    let state = tablesReducer(baseState(), { type: 'select', tableId: 't1' })
    state = tablesReducer(state, { type: 'setStatus', tableId: 't3', status: 'occupied' })
    expect(state.selectedTableId).toBe('t1')
  })
})

describe('groupByArea', () => {
  it('groups tables by area preserving first-seen order', () => {
    const groups = groupByArea(baseState().tables)
    expect(groups.map((g) => g.area)).toEqual(['Ground Floor', 'Terrace'])
    expect(groups[0].tables).toHaveLength(2)
    expect(groups[1].tables).toHaveLength(1)
  })
})

describe('summarize', () => {
  it('counts tables by status', () => {
    expect(summarize(baseState().tables)).toEqual({ free: 2, occupied: 0, reserved: 1 })
  })
})
