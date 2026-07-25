import { formatMinor } from '../lib/money'
import { useOrders } from '../features/orders/OrdersStore'
import { STATUS_META } from '../features/orders/status'

const TIME_FMT = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' })

export default function OrdersPage() {
  const { orders, clearAll } = useOrders()

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <h1 className="text-lg font-semibold">Orders</h1>
        {orders.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700"
          >
            Clear all
          </button>
        )}
      </header>

      {orders.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-6 text-center text-slate-500">
          <p>No orders yet. Send one from the POS to see it here.</p>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {orders.map((order) => {
              const meta = STATUS_META[order.status]
              const items = order.lines.reduce((n, l) => n + l.quantity, 0)
              return (
                <li
                  key={order.id}
                  className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4"
                >
                  <span className="text-sm font-semibold text-slate-100">#{order.number}</span>
                  <span className="w-28 text-xs uppercase tracking-wide text-slate-400">
                    {order.type}
                    {order.tableLabel && (
                      <span className="ml-1 text-slate-500">· {order.tableLabel}</span>
                    )}
                  </span>
                  <span className="flex-1 text-sm text-slate-400">
                    {items} item{items === 1 ? '' : 's'}
                  </span>
                  {order.paymentMethod && (
                    <span className="w-12 text-xs uppercase text-slate-500">
                      {order.paymentMethod}
                    </span>
                  )}
                  <span className="text-xs text-slate-500">
                    {TIME_FMT.format(new Date(order.placedAt))}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${meta.badge}`}>
                    {meta.label}
                  </span>
                  <span className="w-24 text-right text-sm font-semibold">
                    {formatMinor(order.totalMinor)}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
