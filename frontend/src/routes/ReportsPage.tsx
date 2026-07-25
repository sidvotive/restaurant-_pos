import type { OrderType, PaymentMethod } from '../types/domain'
import { formatMinor } from '../lib/money'
import { useOrders } from '../features/orders/OrdersStore'
import {
  salesByPayment,
  salesByType,
  summarizeSales,
  topItems,
} from '../features/reports/salesReport'
import { ordersToCsv } from '../features/reports/exportCsv'

const TYPE_LABEL: Record<OrderType, string> = {
  'dine-in': 'Dine-in',
  takeaway: 'Takeaway',
  delivery: 'Delivery',
}

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  cash: 'Cash',
  card: 'Card',
  upi: 'UPI',
  qr: 'QR',
}

interface BarRow {
  key: string
  label: string
  count: number
  salesMinor: number
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-100">{value}</p>
    </div>
  )
}

/** Single-series magnitude bars (one hue), each row directly labelled. */
function BreakdownBars({ title, rows }: { title: string; rows: BarRow[] }) {
  const maxSales = Math.max(1, ...rows.map((r) => r.salesMinor))
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-sm text-slate-300">{row.label}</span>
            <div className="h-3 flex-1 overflow-hidden rounded-md bg-slate-800">
              <div
                className="h-full rounded-md bg-amber-500"
                style={{ width: `${(row.salesMinor / maxSales) * 100}%` }}
                title={`${row.count} order${row.count === 1 ? '' : 's'} · ${formatMinor(row.salesMinor)}`}
              />
            </div>
            <span className="w-16 shrink-0 text-right text-xs text-slate-400">{row.count}</span>
            <span className="w-24 shrink-0 text-right text-sm font-medium text-slate-200">
              {formatMinor(row.salesMinor)}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function ReportsPage() {
  const { orders } = useOrders()
  const summary = summarizeSales(orders)
  const byType = salesByType(orders)
  const byPayment = salesByPayment(orders)
  const top = topItems(orders, 5)

  function handleExport() {
    const csv = ordersToCsv(orders)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sales-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <h1 className="text-lg font-semibold">Reports</h1>
        {orders.length > 0 && (
          <button
            type="button"
            onClick={handleExport}
            className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
          >
            Export CSV
          </button>
        )}
      </header>

      {orders.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-6 text-center text-slate-500">
          <p>No sales yet. Orders sent from the POS show up here.</p>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {/* KPI tiles — hero numbers, no chart. */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <StatTile label="Orders" value={String(summary.orderCount)} />
            <StatTile label="Sales" value={formatMinor(summary.totalSalesMinor)} />
            <StatTile label="Avg order" value={formatMinor(summary.averageOrderMinor)} />
            <StatTile label="Items sold" value={String(summary.itemCount)} />
            <StatTile label="Tax collected" value={formatMinor(summary.taxCollectedMinor)} />
            <StatTile label="Discounts" value={formatMinor(summary.discountGivenMinor)} />
          </div>

          {/* Single-series magnitude bars (one hue). */}
          <BreakdownBars
            title="Sales by order type"
            rows={byType.map((r) => ({
              key: r.type,
              label: TYPE_LABEL[r.type],
              count: r.count,
              salesMinor: r.salesMinor,
            }))}
          />
          <BreakdownBars
            title="Sales by payment mode"
            rows={byPayment.map((r) => ({
              key: r.method,
              label: PAYMENT_LABEL[r.method],
              count: r.count,
              salesMinor: r.salesMinor,
            }))}
          />

          {/* Top items. */}
          <section className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Top items
            </h2>
            <ul className="space-y-2">
              {top.map((item, i) => (
                <li
                  key={item.name}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3"
                >
                  <span className="w-6 text-center text-sm text-slate-500">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate text-sm text-slate-200">{item.name}</span>
                  <span className="text-xs text-slate-400">×{item.quantity}</span>
                  <span className="w-24 text-right text-sm font-medium text-amber-300">
                    {formatMinor(item.salesMinor)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  )
}
