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

interface CartLoad {
  lines: CartLine[]
  orderType: OrderType
  discountMinor: number
  tipMinor: number
}

interface CartContextValue {
  lines: CartLine[]
  orderType: OrderType
  discountMinor: number
  tipMinor: number
  totals: BillTotals
  itemCount: number
  add: (product: Product) => void
  decrement: (productId: string) => void
  remove: (productId: string) => void
  clear: () => void
  setOrderType: (orderType: OrderType) => void
  setDiscount: (discountMinor: number) => void
  setTip: (tipMinor: number) => void
  loadBill: (bill: CartLoad) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState)

  const value = useMemo<CartContextValue>(() => {
    const totals = computeTotals(state.lines, {
      discountMinor: state.discountMinor,
      tipMinor: state.tipMinor,
    })
    const itemCount = state.lines.reduce((n, l) => n + l.quantity, 0)
    return {
      lines: state.lines,
      orderType: state.orderType,
      discountMinor: state.discountMinor,
      tipMinor: state.tipMinor,
      totals,
      itemCount,
      add: (product) => dispatch({ type: 'add', product }),
      decrement: (productId) => dispatch({ type: 'decrement', productId }),
      remove: (productId) => dispatch({ type: 'remove', productId }),
      clear: () => dispatch({ type: 'clear' }),
      setOrderType: (orderType) => dispatch({ type: 'setOrderType', orderType }),
      setDiscount: (discountMinor) => dispatch({ type: 'setDiscount', discountMinor }),
      setTip: (tipMinor) => dispatch({ type: 'setTip', tipMinor }),
      loadBill: (bill) =>
        dispatch({
          type: 'load',
          state: {
            lines: bill.lines,
            orderType: bill.orderType,
            discountMinor: bill.discountMinor,
            tipMinor: bill.tipMinor,
          },
        }),
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
