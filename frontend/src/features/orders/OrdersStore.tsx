import { createContext, useContext, useMemo, useReducer, useRef, type ReactNode } from 'react'
import type { CartLine, Order, OrderType } from '../../types/domain'
import { ordersReducer, initialOrdersState } from './ordersReducer'

interface PlaceOrderInput {
  lines: CartLine[]
  orderType: OrderType
  totalMinor: number
}

interface OrdersContextValue {
  orders: Order[]
  placeOrder: (input: PlaceOrderInput) => Order
  advance: (orderId: string) => void
}

const OrdersContext = createContext<OrdersContextValue | null>(null)

function newId(): string {
  // crypto.randomUUID is available in modern browsers and Node 22.
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ordersReducer, initialOrdersState)
  const counter = useRef(0)

  const value = useMemo<OrdersContextValue>(
    () => ({
      orders: state.orders,
      placeOrder: ({ lines, orderType, totalMinor }) => {
        counter.current += 1
        const order: Order = {
          id: newId(),
          number: counter.current,
          type: orderType,
          lines,
          totalMinor,
          status: 'placed',
          placedAt: new Date().toISOString(),
        }
        dispatch({ type: 'place', order })
        return order
      },
      advance: (orderId) => dispatch({ type: 'advance', orderId }),
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
