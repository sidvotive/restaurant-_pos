import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { RestaurantTable, TableStatus } from '../../types/domain'
import { loadJson, saveJson } from '../../lib/persist'
import { tablesClient } from '../../lib/api/tablesClient'
import { useAuth } from '../auth/AuthContext'
import { tablesReducer, type TablesState } from './tablesReducer'
import { mockTables } from './mockTables'

const STORAGE_KEY = 'rpos.tables'
const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

interface TablesContextValue {
  tables: RestaurantTable[]
  selectedTableId: string | null
  selectedTable: RestaurantTable | null
  select: (tableId: string | null) => void
  setStatus: (tableId: string, status: TableStatus) => void
  reserve: (tableId: string, name: string) => void
}

const TablesContext = createContext<TablesContextValue | null>(null)

// Mock mode starts from the placeholder floor; full-stack mode starts empty and
// loads the tenant's tables (the server seeds a default layout on first access).
const initialState: TablesState = {
  tables: USE_MOCK ? mockTables : [],
  selectedTableId: null,
}

export function TablesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [state, dispatch] = useReducer(
    tablesReducer,
    initialState,
    (init): TablesState => (USE_MOCK ? loadJson<TablesState>(STORAGE_KEY, init) : init),
  )

  // Mock mode: persist to localStorage.
  useEffect(() => {
    if (USE_MOCK) saveJson(STORAGE_KEY, state)
  }, [state])

  // Full-stack mode: load the tenant's floor plan once authenticated.
  useEffect(() => {
    if (USE_MOCK) return
    let cancelled = false
    if (!isAuthenticated) {
      dispatch({ type: 'load', tables: [] })
      return
    }
    tablesClient
      .getTables()
      .then((tables) => {
        if (!cancelled) dispatch({ type: 'load', tables })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [isAuthenticated])

  const value = useMemo<TablesContextValue>(() => {
    const selectedTable =
      state.tables.find((t) => t.id === state.selectedTableId) ?? null

    // Which table this terminal is billing stays client-local in both modes.
    const select = (tableId: string | null) => dispatch({ type: 'select', tableId })

    if (USE_MOCK) {
      return {
        tables: state.tables,
        selectedTableId: state.selectedTableId,
        selectedTable,
        select,
        setStatus: (tableId, status) => dispatch({ type: 'setStatus', tableId, status }),
        reserve: (tableId, name) => dispatch({ type: 'reserve', tableId, name }),
      }
    }

    async function refetch() {
      dispatch({ type: 'load', tables: await tablesClient.getTables() })
    }

    return {
      tables: state.tables,
      selectedTableId: state.selectedTableId,
      selectedTable,
      select,
      setStatus: (tableId, status) => void tablesClient.setStatus(tableId, status).then(refetch),
      reserve: (tableId, name) => void tablesClient.reserve(tableId, name).then(refetch),
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
