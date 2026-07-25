import type { Order } from '../../types/domain'

const HEADER = [
  'Order',
  'Placed At',
  'Type',
  'Table',
  'Payment',
  'Customer',
  'Subtotal',
  'Discount',
  'Tax',
  'Tip',
  'Total',
]

/** Quote a field if it contains a comma, quote, or newline (RFC 4180). */
function csvField(value: string | number): string {
  const s = String(value)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** Major-unit amount with two decimals (no currency symbol) for spreadsheets. */
function amount(minor: number | undefined): string {
  return ((minor ?? 0) / 100).toFixed(2)
}

/** Serialises orders to a CSV string (one row per order). */
export function ordersToCsv(orders: Order[]): string {
  const rows = orders.map((o) => [
    o.number,
    o.placedAt,
    o.type,
    o.tableLabel ?? '',
    o.paymentMethod ?? '',
    o.customerName ?? '',
    amount(o.subtotalMinor),
    amount(o.discountMinor),
    amount(o.taxMinor),
    amount(o.tipMinor),
    amount(o.totalMinor),
  ])
  return [HEADER, ...rows].map((row) => row.map(csvField).join(',')).join('\n')
}
