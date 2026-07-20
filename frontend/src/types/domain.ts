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
  /** Discount applied to the subtotal (never more than the subtotal). */
  discountMinor: number
  /** Tax on the discounted subtotal. */
  taxMinor: number
  /** Gratuity added after tax. */
  tipMinor: number
  totalMinor: number
}

// Kitchen/order lifecycle. The KDS advances placed → preparing → ready; the
// floor marks ready orders served. Mirrors the Orders service contract (#6).
export type OrderStatus = 'placed' | 'preparing' | 'ready' | 'served'

export interface Order {
  id: string
  /** Human-friendly sequential number for staff. */
  number: number
  type: OrderType
  lines: CartLine[]
  totalMinor: number
  status: OrderStatus
  /** ISO timestamp. */
  placedAt: string
  /** Dine-in table label, when the order is tied to a table. */
  tableLabel?: string
}

// Floor / table management (issue #5).
export type TableStatus = 'free' | 'occupied' | 'reserved'

export interface RestaurantTable {
  id: string
  label: string
  area: string
  seats: number
  status: TableStatus
}
