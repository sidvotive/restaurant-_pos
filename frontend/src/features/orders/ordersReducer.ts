import type { Order, OrderStatus } from '../../types/domain'

export interface OrdersState {
  orders: Order[]
}

export type OrdersAction =
  | { type: 'load'; orders: Order[] }
  | { type: 'place'; order: Order }
  | { type: 'advance'; orderId: string }
  | { type: 'cancel'; orderId: string }
  | { type: 'clear' }

export const initialOrdersState: OrdersState = { orders: [] }

/** The forward-only status progression driven by the KDS / floor. */
const NEXT_STATUS: Record<OrderStatus, OrderStatus> = {
  placed: 'preparing',
  preparing: 'ready',
  ready: 'served',
  served: 'served',
  cancelled: 'cancelled',
}

export function nextStatus(status: OrderStatus): OrderStatus {
  return NEXT_STATUS[status]
}

export function ordersReducer(state: OrdersState, action: OrdersAction): OrdersState {
  switch (action.type) {
    case 'load':
      return { orders: action.orders }
    case 'place':
      // Newest first.
      return { orders: [action.order, ...state.orders] }
    case 'advance':
      return {
        orders: state.orders.map((o) =>
          // A cancelled order cannot be advanced.
          o.id === action.orderId && o.status !== 'cancelled'
            ? { ...o, status: nextStatus(o.status) }
            : o,
        ),
      }
    case 'cancel':
      return {
        orders: state.orders.map((o) =>
          o.id === action.orderId ? { ...o, status: 'cancelled' } : o,
        ),
      }
    case 'clear':
      return { orders: [] }
    default:
      return state
  }
}
