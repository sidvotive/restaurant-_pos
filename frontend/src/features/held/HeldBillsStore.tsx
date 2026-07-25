import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { CartLine, HeldBill, OrderType } from '../../types/domain'
import { loadJson, saveJson } from '../../lib/persist'
import { heldBillsReducer, initialHeldBillsState, type HeldBillsState } from './heldBillsReducer'

const STORAGE_KEY = 'rpos.heldBills'

interface HoldInput {
  lines: CartLine[]
  orderType: OrderType
  discountMinor: number
  tipMinor: number
  tableId?: string
  tableLabel?: string
}

interface HeldBillsContextValue {
  bills: HeldBill[]
  hold: (input: HoldInput) => void
  /** Removes and returns the held bill, or null if not found. */
  resume: (id: string) => HeldBill | null
  remove: (id: string) => void
}

const HeldBillsContext = createContext<HeldBillsContextValue | null>(null)

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)
}

export function HeldBillsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    heldBillsReducer,
    initialHeldBillsState,
    (init): HeldBillsState => loadJson<HeldBillsState>(STORAGE_KEY, init),
  )

  useEffect(() => {
    saveJson(STORAGE_KEY, state)
  }, [state])

  const value = useMemo<HeldBillsContextValue>(
    () => ({
      bills: state.bills,
      hold: (input) =>
        dispatch({
          type: 'hold',
          bill: { id: newId(), heldAt: new Date().toISOString(), ...input },
        }),
      resume: (id) => {
        const bill = state.bills.find((b) => b.id === id) ?? null
        if (bill) dispatch({ type: 'remove', id })
        return bill
      },
      remove: (id) => dispatch({ type: 'remove', id }),
    }),
    [state],
  )

  return <HeldBillsContext.Provider value={value}>{children}</HeldBillsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useHeldBills(): HeldBillsContextValue {
  const ctx = useContext(HeldBillsContext)
  if (!ctx) throw new Error('useHeldBills must be used within a HeldBillsProvider')
  return ctx
}
