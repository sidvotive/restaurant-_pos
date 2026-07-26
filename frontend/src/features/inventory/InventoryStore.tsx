import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { CartLine } from '../../types/domain'
import { loadJson, saveJson } from '../../lib/persist'
import { inventoryClient, toStockMap } from '../../lib/api/inventoryClient'
import { useAuth } from '../auth/AuthContext'
import { initialInventoryState, inventoryReducer, type InventoryState } from './inventoryReducer'

const STORAGE_KEY = 'rpos.inventory'
const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

interface InventoryContextValue {
  stock: Record<string, number>
  setStock: (productId: string, quantity: number) => void
  decrementForOrder: (lines: CartLine[]) => void
}

const InventoryContext = createContext<InventoryContextValue | null>(null)

export function InventoryProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [state, dispatch] = useReducer(
    inventoryReducer,
    initialInventoryState,
    (init): InventoryState => (USE_MOCK ? loadJson<InventoryState>(STORAGE_KEY, init) : init),
  )

  // Mock mode: persist to localStorage.
  useEffect(() => {
    if (USE_MOCK) saveJson(STORAGE_KEY, state)
  }, [state])

  // Full-stack mode: load the tenant's stock once authenticated.
  useEffect(() => {
    if (USE_MOCK) return
    let cancelled = false
    if (!isAuthenticated) {
      dispatch({ type: 'load', stock: {} })
      return
    }
    inventoryClient
      .getStock()
      .then((dtos) => {
        if (!cancelled) dispatch({ type: 'load', stock: toStockMap(dtos) })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [isAuthenticated])

  const value = useMemo<InventoryContextValue>(() => {
    async function refetch() {
      dispatch({ type: 'load', stock: toStockMap(await inventoryClient.getStock()) })
    }

    if (USE_MOCK) {
      return {
        stock: state.stock,
        setStock: (productId, quantity) => dispatch({ type: 'setStock', productId, quantity }),
        decrementForOrder: (lines) => dispatch({ type: 'decrementForOrder', lines }),
      }
    }

    return {
      stock: state.stock,
      setStock: (productId, quantity) =>
        void inventoryClient.setStock(productId, Math.max(0, Math.round(quantity))).then(refetch),
      decrementForOrder: (lines) => {
        if (lines.length > 0) void inventoryClient.decrement(lines).then(refetch)
      },
    }
  }, [state])

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useInventory(): InventoryContextValue {
  const ctx = useContext(InventoryContext)
  if (!ctx) throw new Error('useInventory must be used within an InventoryProvider')
  return ctx
}
