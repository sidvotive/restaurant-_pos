import type { CartLine, OrderType, Product } from '../../types/domain'

export interface CartState {
  lines: CartLine[]
  orderType: OrderType
  discountMinor: number
  tipMinor: number
}

export type CartAction =
  | { type: 'add'; product: Product }
  | { type: 'decrement'; productId: string }
  | { type: 'remove'; productId: string }
  | { type: 'clear' }
  | { type: 'setOrderType'; orderType: OrderType }
  | { type: 'setDiscount'; discountMinor: number }
  | { type: 'setTip'; tipMinor: number }

export const initialCartState: CartState = {
  lines: [],
  orderType: 'dine-in',
  discountMinor: 0,
  tipMinor: 0,
}

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
      // Reset the whole bill (lines and adjustments) but keep the order type.
      return { ...state, lines: [], discountMinor: 0, tipMinor: 0 }
    case 'setOrderType':
      return { ...state, orderType: action.orderType }
    case 'setDiscount':
      return { ...state, discountMinor: Math.max(0, action.discountMinor) }
    case 'setTip':
      return { ...state, tipMinor: Math.max(0, action.tipMinor) }
    default:
      return state
  }
}
