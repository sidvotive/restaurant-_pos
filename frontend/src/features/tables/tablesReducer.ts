import type { RestaurantTable, TableStatus } from '../../types/domain'

export interface TablesState {
  tables: RestaurantTable[]
  selectedTableId: string | null
}

export type TablesAction =
  | { type: 'select'; tableId: string | null }
  | { type: 'setStatus'; tableId: string; status: TableStatus }

export function tablesReducer(state: TablesState, action: TablesAction): TablesState {
  switch (action.type) {
    case 'select':
      return { ...state, selectedTableId: action.tableId }
    case 'setStatus': {
      const tables = state.tables.map((t) =>
        t.id === action.tableId ? { ...t, status: action.status } : t,
      )
      // Deselect a table once it is no longer free.
      const selectedTableId =
        action.tableId === state.selectedTableId && action.status !== 'free'
          ? null
          : state.selectedTableId
      return { tables, selectedTableId }
    }
    default:
      return state
  }
}

export interface AreaGroup {
  area: string
  tables: RestaurantTable[]
}

/** Groups tables by area, preserving first-seen area order. */
export function groupByArea(tables: RestaurantTable[]): AreaGroup[] {
  const groups: AreaGroup[] = []
  for (const table of tables) {
    let group = groups.find((g) => g.area === table.area)
    if (!group) {
      group = { area: table.area, tables: [] }
      groups.push(group)
    }
    group.tables.push(table)
  }
  return groups
}

export function summarize(tables: RestaurantTable[]): Record<TableStatus, number> {
  const summary: Record<TableStatus, number> = { free: 0, occupied: 0, reserved: 0 }
  for (const table of tables) summary[table.status] += 1
  return summary
}
