import type { OrderType } from '../types/domain'
import { formatMinor } from '../lib/money'
import { useOrders } from '../features/orders/OrdersStore'
import { salesByType, summarizeSales, topItems } from '../features/reports/salesReport'

const TYPE_LABEL: Record<OrderType, string> = {
  'dine-in': 'Dine-in',
  takeaway: 'Takeaway',
  delivery: 'Delivery',
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-100">{value}</p>
    </div>
  )
}

export default function ReportsPage() {
  const { orders } = useOrders()
  const summary = summarizeSales(orders)
  const byType = salesByType(orders)
  const top = topItems(orders, 5)
  const maxTypeSales = Math.max(1, ...byType.map((r) => r.salesMinor))

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-b border-slate-800 px-6 py-4">
        <h1 className="text-lg font-semibold">Reports</h1>
      </header>

      {orders.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-6 text-center text-slate-500">
          <p>No sales yet. Orders sent from the POS show up here.</p>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {/* KPI tiles — hero numbers, no chart. */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Orders" value={String(summary.orderCount)} />
            <StatTile label="Sales" value={formatMinor(summary.totalSalesMinor)} />
            <StatTile label="Avg order" value={formatMinor(summary.averageOrderMinor)} />
            <StatTile label="Items sold" value={String(summary.itemCount)} />
          </div>

          {/* Sales by order type — single-series magnitude bars (one hue). */}
          <section className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Sales by order type
            </h2>
            <div className="space-y-3">
              {byType.map((row) => (
                <div key={row.type} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-sm text-slate-300">
                    {TYPE_LABEL[row.type]}
                  </span>
                  <div className="h-3 flex-1 overflow-hidden rounded-md bg-slate-800">
                    <div
                      className="h-full rounded-md bg-amber-500"
                      style={{ width: `${(row.salesMinor / maxTypeSales) * 100}%` }}
                      title={`${row.count} order${row.count === 1 ? '' : 's'} · ${formatMinor(row.salesMinor)}`}
                    />
                  </div>
                  <span className="w-16 shrink-0 text-right text-xs text-slate-400">
                    {row.count}
                  </span>
                  <span className="w-24 shrink-0 text-right text-sm font-medium text-slate-200">
                    {formatMinor(row.salesMinor)}
                  </span>
                </div>
              ))}
            </div>
          </section>

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
