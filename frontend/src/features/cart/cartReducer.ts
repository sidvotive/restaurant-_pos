import type { CartLine, OrderType, Product } from '../../types/domain'

export interface CartState {
  lines: CartLine[]
  orderType: OrderType
}

export type CartAction =
  | { type: 'add'; product: Product }
  | { type: 'decrement'; productId: string }
  | { type: 'remove'; productId: string }
  | { type: 'clear' }
  | { type: 'setOrderType'; orderType: OrderType }

export const initialCartState: CartState = { lines: [], orderType: 'dine-in' }

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const existing = state.lines.find((l) => l.product.id === action.product.id)
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.product.id === action.product.id
              ? { ...l, quantity: l.quantity + 1 }
              : l,
          ),
        }
      }
      return { ...state, lines: [...state.lines, { product: action.product, quantity: 1 }] }
    }
    case 'decrement': {
      return {
        ...state,
        lines: state.lines
          .map((l) =>
            l.product.id === action.productId
              ? { ...l, quantity: l.quantity - 1 }
              : l,
          )
          .filter((l) => l.quantity > 0),
      }
    }
    case 'remove':
      return { ...state, lines: state.lines.filter((l) => l.product.id !== action.productId) }
    case 'clear':
      return { ...state, lines: [] }
    case 'setOrderType':
      return { ...state, orderType: action.orderType }
    default:
      return state
  }
}
