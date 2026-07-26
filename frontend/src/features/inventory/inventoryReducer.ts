import type { CartLine } from '../../types/domain'

/** Stock levels keyed by product id. A product absent from the map is untracked. */
export interface InventoryState {
  stock: Record<string, number>
}

export type InventoryAction =
  | { type: 'load'; stock: Record<string, number> }
  | { type: 'setStock'; productId: string; quantity: number }
  | { type: 'decrementForOrder'; lines: CartLine[] }

export const initialInventoryState: InventoryState = { stock: {} }

export function inventoryReducer(state: InventoryState, action: InventoryAction): InventoryState {
  switch (action.type) {
    case 'load':
      return { stock: action.stock }
    case 'setStock':
      return {
        stock: { ...state.stock, [action.productId]: Math.max(0, Math.round(action.quantity)) },
      }
    case 'decrementForOrder': {
      const stock = { ...state.stock }
      for (const line of action.lines) {
        // Only tracked products are decremented; stock never goes below zero.
        if (line.product.id in stock) {
          stock[line.product.id] = Math.max(0, stock[line.product.id] - line.quantity)
        }
      }
      return { stock }
    }
    default:
      return state
  }
}
