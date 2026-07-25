import type { HeldBill } from '../../types/domain'

export interface HeldBillsState {
  bills: HeldBill[]
}

export type HeldBillsAction =
  | { type: 'hold'; bill: HeldBill }
  | { type: 'remove'; id: string }

export const initialHeldBillsState: HeldBillsState = { bills: [] }

export function heldBillsReducer(state: HeldBillsState, action: HeldBillsAction): HeldBillsState {
  switch (action.type) {
    case 'hold':
      // Newest first.
      return { bills: [action.bill, ...state.bills] }
    case 'remove':
      return { bills: state.bills.filter((b) => b.id !== action.id) }
    default:
      return state
  }
}
