import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { BillTotals, CartLine, Order, OrderType, PaymentMethod } from '../../types/domain'
import { loadJson, saveJson } from '../../lib/persist'
import { ordersClient, type PlaceOrderBody } from '../../lib/api/ordersClient'
import { useAuth } from '../auth/AuthContext'
import { ordersReducer, initialOrdersState, type OrdersState } from './ordersReducer'

const STORAGE_KEY = 'rpos.orders'
const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

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
  placeOrder: (input: PlaceOrderInput) => Promise<Order>
  advance: (orderId: string) => void
  cancel: (orderId: string) => void
  clearAll: () => void
}

const OrdersContext = createContext<OrdersContextValue | null>(null)

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)
}

/** Next human-friendly order number: one past the highest existing number. */
function nextNumber(orders: Order[]): number {
  return orders.reduce((max, o) => Math.max(max, o.number), 0) + 1
}

function toBody(input: PlaceOrderInput): PlaceOrderBody {
  return {
    type: input.orderType,
    lines: input.lines.map((l) => ({
      productId: l.product.id,
      name: l.product.name,
      unitPriceMinor: l.product.priceMinor,
      quantity: l.quantity,
    })),
    subtotalMinor: input.totals.subtotalMinor,
    discountMinor: input.totals.discountMinor,
    taxMinor: input.totals.taxMinor,
    tipMinor: input.totals.tipMinor,
    totalMinor: input.totals.totalMinor,
    tableLabel: input.tableLabel,
    paymentMethod: input.paymentMethod,
    customerName: input.customerName?.trim() || undefined,
    customerPhone: input.customerPhone?.trim() || undefined,
  }
}

function toMockOrder(input: PlaceOrderInput, orders: Order[]): Order {
  return {
    id: newId(),
    number: nextNumber(orders),
    type: input.orderType,
    lines: input.lines,
    totalMinor: input.totals.totalMinor,
    subtotalMinor: input.totals.subtotalMinor,
    discountMinor: input.totals.discountMinor,
    taxMinor: input.totals.taxMinor,
    tipMinor: input.totals.tipMinor,
    status: 'placed',
    placedAt: new Date().toISOString(),
    tableLabel: input.tableLabel,
    paymentMethod: input.paymentMethod,
    customerName: input.customerName?.trim() || undefined,
    customerPhone: input.customerPhone?.trim() || undefined,
  }
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [state, dispatch] = useReducer(
    ordersReducer,
    initialOrdersState,
    (init): OrdersState =>
      USE_MOCK ? { orders: loadJson<Order[]>(STORAGE_KEY, init.orders) } : init,
  )

  // Mock mode: persist to localStorage.
  useEffect(() => {
    if (USE_MOCK) saveJson(STORAGE_KEY, state.orders)
  }, [state.orders])

  // Full-stack mode: load the tenant's orders once authenticated.
  useEffect(() => {
    if (USE_MOCK) return
    let cancelled = false
    if (!isAuthenticated) {
      dispatch({ type: 'load', orders: [] })
      return
    }
    ordersClient
      .getOrders()
      .then((orders) => {
        if (!cancelled) dispatch({ type: 'load', orders })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [isAuthenticated])

  const value = useMemo<OrdersContextValue>(() => {
    async function refetch() {
      dispatch({ type: 'load', orders: await ordersClient.getOrders() })
    }

    if (USE_MOCK) {
      return {
        orders: state.orders,
        placeOrder: (input) => {
          const order = toMockOrder(input, state.orders)
          dispatch({ type: 'place', order })
          return Promise.resolve(order)
        },
        advance: (orderId) => dispatch({ type: 'advance', orderId }),
        cancel: (orderId) => dispatch({ type: 'cancel', orderId }),
        clearAll: () => dispatch({ type: 'clear' }),
      }
    }

    return {
      orders: state.orders,
      placeOrder: async (input) => {
        const order = await ordersClient.place(toBody(input))
        await refetch()
        return order
      },
      advance: (orderId) => void ordersClient.advance(orderId).then(refetch),
      cancel: (orderId) => void ordersClient.cancel(orderId).then(refetch),
      clearAll: () => void ordersClient.clear().then(refetch),
    }
  }, [state])

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within an OrdersProvider')
  return ctx
}
