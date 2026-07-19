import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import type { BillTotals, CartLine, OrderType, Product } from '../../types/domain'
import { computeTotals } from './cartTotals'

interface CartState {
  lines: CartLine[]
  orderType: OrderType
}

type CartAction =
  | { type: 'add'; product: Product }
  | { type: 'decrement'; productId: string }
  | { type: 'remove'; productId: string }
  | { type: 'clear' }
  | { type: 'setOrderType'; orderType: OrderType }

function reducer(state: CartState, action: CartAction): CartState {
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

interface CartContextValue {
  lines: CartLine[]
  orderType: OrderType
  totals: BillTotals
  itemCount: number
  add: (product: Product) => void
  decrement: (productId: string) => void
  remove: (productId: string) => void
  clear: () => void
  setOrderType: (orderType: OrderType) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], orderType: 'dine-in' })

  const value = useMemo<CartContextValue>(() => {
    const totals = computeTotals(state.lines)
    const itemCount = state.lines.reduce((n, l) => n + l.quantity, 0)
    return {
      lines: state.lines,
      orderType: state.orderType,
      totals,
      itemCount,
      add: (product) => dispatch({ type: 'add', product }),
      decrement: (productId) => dispatch({ type: 'decrement', productId }),
      remove: (productId) => dispatch({ type: 'remove', productId }),
      clear: () => dispatch({ type: 'clear' }),
      setOrderType: (orderType) => dispatch({ type: 'setOrderType', orderType }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
