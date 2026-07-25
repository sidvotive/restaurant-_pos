import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { BillTotals, CartLine, Order, OrderType, PaymentMethod } from '../../types/domain'
import { loadJson, saveJson } from '../../lib/persist'
import { ordersReducer, initialOrdersState, type OrdersState } from './ordersReducer'

const STORAGE_KEY = 'rpos.orders'

interface PlaceOrderInput {
  lines: CartLine[]
  orderType: OrderType
  totals: BillTotals
  tableLabel?: string
  paymentMethod: PaymentMethod
  customerName?: string
  customerPhone?: string
}

interface OrdersContextValue {
  orders: Order[]
  placeOrder: (input: PlaceOrderInput) => Order
  advance: (orderId: string) => void
  clearAll: () => void
}

const OrdersContext = createContext<OrdersContextValue | null>(null)

function newId(): string {
  // crypto.randomUUID is available in modern browsers and Node 22.
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)
}

/** Next human-friendly order number: one past the highest existing number. */
function nextNumber(orders: Order[]): number {
  return orders.reduce((max, o) => Math.max(max, o.number), 0) + 1
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    ordersReducer,
    initialOrdersState,
    (init): OrdersState => ({ orders: loadJson<Order[]>(STORAGE_KEY, init.orders) }),
  )

  // Persist on every change so orders survive a refresh.
  useEffect(() => {
    saveJson(STORAGE_KEY, state.orders)
  }, [state.orders])

  const value = useMemo<OrdersContextValue>(
    () => ({
      orders: state.orders,
      placeOrder: ({
        lines,
        orderType,
        totals,
        tableLabel,
        paymentMethod,
        customerName,
        customerPhone,
      }) => {
        const order: Order = {
          id: newId(),
          number: nextNumber(state.orders),
          type: orderType,
          lines,
          totalMinor: totals.totalMinor,
          subtotalMinor: totals.subtotalMinor,
          discountMinor: totals.discountMinor,
          taxMinor: totals.taxMinor,
          tipMinor: totals.tipMinor,
          status: 'placed',
          placedAt: new Date().toISOString(),
          tableLabel,
          paymentMethod,
          customerName: customerName?.trim() || undefined,
          customerPhone: customerPhone?.trim() || undefined,
        }
        dispatch({ type: 'place', order })
        return order
      },
      advance: (orderId) => dispatch({ type: 'advance', orderId }),
      clearAll: () => dispatch({ type: 'clear' }),
    }),
    [state],
  )

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within an OrdersProvider')
  return ctx
}
