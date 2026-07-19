// Core domain types for the POS surface.
// These mirror the backend contracts (see docs/product/modules.md) and are the
// shapes the API client will return once the backend lands.

export type OrderType = 'dine-in' | 'takeaway' | 'delivery'

export interface Category {
  id: string
  name: string
}

export interface Product {
  id: string
  categoryId: string
  name: string
  /** Base price in minor units (paise/cents) to avoid float rounding. */
  priceMinor: number
}

export interface CartLine {
  product: Product
  quantity: number
}

export interface BillTotals {
  /** Sum of line totals before tax/discount, in minor units. */
  subtotalMinor: number
  taxMinor: number
  totalMinor: number
}
