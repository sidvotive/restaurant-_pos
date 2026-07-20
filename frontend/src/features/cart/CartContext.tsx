import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import type { BillTotals, CartLine, OrderType, Product } from '../../types/domain'
import { computeTotals } from './cartTotals'
import { cartReducer, initialCartState } from './cartReducer'

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
  const [state, dispatch] = useReducer(cartReducer, initialCartState)

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
