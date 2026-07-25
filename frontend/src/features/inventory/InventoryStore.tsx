import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { CartLine } from '../../types/domain'
import { loadJson, saveJson } from '../../lib/persist'
import { initialInventoryState, inventoryReducer, type InventoryState } from './inventoryReducer'

const STORAGE_KEY = 'rpos.inventory'

interface InventoryContextValue {
  stock: Record<string, number>
  setStock: (productId: string, quantity: number) => void
  decrementForOrder: (lines: CartLine[]) => void
}

const InventoryContext = createContext<InventoryContextValue | null>(null)

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    inventoryReducer,
    initialInventoryState,
    (init): InventoryState => loadJson<InventoryState>(STORAGE_KEY, init),
  )

  useEffect(() => {
    saveJson(STORAGE_KEY, state)
  }, [state])

  const value = useMemo<InventoryContextValue>(
    () => ({
      stock: state.stock,
      setStock: (productId, quantity) => dispatch({ type: 'setStock', productId, quantity }),
      decrementForOrder: (lines) => dispatch({ type: 'decrementForOrder', lines }),
    }),
    [state],
  )

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useInventory(): InventoryContextValue {
  const ctx = useContext(InventoryContext)
  if (!ctx) throw new Error('useInventory must be used within an InventoryProvider')
  return ctx
}
