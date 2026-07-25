import type { Order, OrderType, PaymentMethod } from '../../types/domain'
import { lineTotalMinor } from '../cart/cartTotals'

export interface SalesSummary {
  orderCount: number
  totalSalesMinor: number
  averageOrderMinor: number
  itemCount: number
  /** Tax collected across orders (0 for orders placed before breakdown capture). */
  taxCollectedMinor: number
  /** Total discounts given across orders. */
  discountGivenMinor: number
}

export interface TypeBreakdownRow {
  type: OrderType
  count: number
  salesMinor: number
}

export interface TopItemRow {
  name: string
  quantity: number
  salesMinor: number
}

export interface PaymentBreakdownRow {
  method: PaymentMethod
  count: number
  salesMinor: number
}

const ORDER_TYPES: OrderType[] = ['dine-in', 'takeaway', 'delivery']
const PAYMENT_METHODS: PaymentMethod[] = ['cash', 'card', 'upi', 'qr']

/** Cancelled orders never count towards sales. */
function billable(orders: Order[]): Order[] {
  return orders.filter((o) => o.status !== 'cancelled')
}

export function summarizeSales(all: Order[]): SalesSummary {
  const orders = billable(all)
  const orderCount = orders.length
  const totalSalesMinor = orders.reduce((sum, o) => sum + o.totalMinor, 0)
  const itemCount = orders.reduce(
    (sum, o) => sum + o.lines.reduce((n, l) => n + l.quantity, 0),
    0,
  )
  return {
    orderCount,
    totalSalesMinor,
    // Integer minor units; average rounded to the nearest unit.
    averageOrderMinor: orderCount === 0 ? 0 : Math.round(totalSalesMinor / orderCount),
    itemCount,
    taxCollectedMinor: orders.reduce((sum, o) => sum + (o.taxMinor ?? 0), 0),
    discountGivenMinor: orders.reduce((sum, o) => sum + (o.discountMinor ?? 0), 0),
  }
}

/** Sales grouped by order type, always in a fixed order and including zeros. */
export function salesByType(all: Order[]): TypeBreakdownRow[] {
  const orders = billable(all)
  return ORDER_TYPES.map((type) => {
    const forType = orders.filter((o) => o.type === type)
    return {
      type,
      count: forType.length,
      salesMinor: forType.reduce((sum, o) => sum + o.totalMinor, 0),
    }
  })
}

/** Sales grouped by payment method (fixed order, includes zeros). Orders
 *  placed before payment capture default to cash. */
export function salesByPayment(all: Order[]): PaymentBreakdownRow[] {
  const orders = billable(all)
  return PAYMENT_METHODS.map((method) => {
    const forMethod = orders.filter((o) => (o.paymentMethod ?? 'cash') === method)
    return {
      method,
      count: forMethod.length,
      salesMinor: forMethod.reduce((sum, o) => sum + o.totalMinor, 0),
    }
  })
}

/** Best-selling menu items by quantity, then by revenue. */
export function topItems(all: Order[], limit = 5): TopItemRow[] {
  const orders = billable(all)
  const byName = new Map<string, TopItemRow>()
  for (const order of orders) {
    for (const line of order.lines) {
      const row = byName.get(line.product.name) ?? {
        name: line.product.name,
        quantity: 0,
        salesMinor: 0,
      }
      row.quantity += line.quantity
      row.salesMinor += lineTotalMinor(line)
      byName.set(line.product.name, row)
    }
  }
  return [...byName.values()]
    .sort((a, b) => b.quantity - a.quantity || b.salesMinor - a.salesMinor)
    .slice(0, limit)
}
