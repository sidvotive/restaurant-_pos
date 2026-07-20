import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { RestaurantTable, TableStatus } from '../../types/domain'
import { loadJson, saveJson } from '../../lib/persist'
import { tablesReducer, type TablesState } from './tablesReducer'
import { mockTables } from './mockTables'

const STORAGE_KEY = 'rpos.tables'

interface TablesContextValue {
  tables: RestaurantTable[]
  selectedTableId: string | null
  selectedTable: RestaurantTable | null
  select: (tableId: string | null) => void
  setStatus: (tableId: string, status: TableStatus) => void
}

const TablesContext = createContext<TablesContextValue | null>(null)

const initialState: TablesState = { tables: mockTables, selectedTableId: null }

export function TablesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    tablesReducer,
    initialState,
    (init): TablesState => loadJson<TablesState>(STORAGE_KEY, init),
  )

  useEffect(() => {
    saveJson(STORAGE_KEY, state)
  }, [state])

  const value = useMemo<TablesContextValue>(() => {
    const selectedTable =
      state.tables.find((t) => t.id === state.selectedTableId) ?? null
    return {
      tables: state.tables,
      selectedTableId: state.selectedTableId,
      selectedTable,
      select: (tableId) => dispatch({ type: 'select', tableId }),
      setStatus: (tableId, status) => dispatch({ type: 'setStatus', tableId, status }),
    }
  }, [state])

  return <TablesContext.Provider value={value}>{children}</TablesContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTables(): TablesContextValue {
  const ctx = useContext(TablesContext)
  if (!ctx) throw new Error('useTables must be used within a TablesProvider')
  return ctx
}
