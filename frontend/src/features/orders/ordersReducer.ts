import type { Order, OrderStatus } from '../../types/domain'

export interface OrdersState {
  orders: Order[]
}

export type OrdersAction =
  | { type: 'place'; order: Order }
  | { type: 'advance'; orderId: string }

export const initialOrdersState: OrdersState = { orders: [] }

/** The forward-only status progression driven by the KDS / floor. */
const NEXT_STATUS: Record<OrderStatus, OrderStatus> = {
  placed: 'preparing',
  preparing: 'ready',
  ready: 'served',
  served: 'served',
}

export function nextStatus(status: OrderStatus): OrderStatus {
  return NEXT_STATUS[status]
}

export function ordersReducer(state: OrdersState, action: OrdersAction): OrdersState {
  switch (action.type) {
    case 'place':
      // Newest first.
      return { orders: [action.order, ...state.orders] }
    case 'advance':
      return {
        orders: state.orders.map((o) =>
          o.id === action.orderId ? { ...o, status: nextStatus(o.status) } : o,
        ),
      }
    default:
      return state
  }
}
