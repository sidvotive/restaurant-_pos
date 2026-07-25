import type { Order } from '../types/domain'
import { useOrders } from '../features/orders/OrdersStore'
import { STATUS_META } from '../features/orders/status'

const TIME_FMT = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' })

function Ticket({ order, onAdvance }: { order: Order; onAdvance: (id: string) => void }) {
  const meta = STATUS_META[order.status]
  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold">#{order.number}</span>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${meta.badge}`}>
          {meta.label}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
        <span className="uppercase tracking-wide">{order.type}</span>
        {order.tableLabel && (
          <>
            <span>·</span>
            <span className="text-slate-400">{order.tableLabel}</span>
          </>
        )}
        <span>·</span>
        <span>{TIME_FMT.format(new Date(order.placedAt))}</span>
      </div>

      <ul className="mt-3 flex-1 space-y-1 text-sm">
        {order.lines.map((line) => (
          <li key={line.product.id} className="flex justify-between">
            <span className="text-slate-200">{line.product.name}</span>
            <span className="text-slate-400">×{line.quantity}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onAdvance(order.id)}
        className="mt-4 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400"
      >
        {meta.advanceLabel}
      </button>
    </div>
  )
}

export default function KdsPage() {
  const { orders, advance } = useOrders()
  // The kitchen board shows active tickets only (not served or cancelled).
  const active = orders.filter((o) => o.status !== 'served' && o.status !== 'cancelled')

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-b border-slate-800 px-6 py-4">
        <h1 className="text-lg font-semibold">Kitchen Display</h1>
      </header>

      {active.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-6 text-center text-slate-500">
          <p>No active tickets. New orders appear here as they are sent.</p>
        </div>
      ) : (
        <div className="grid flex-1 content-start gap-3 overflow-y-auto p-4 sm:grid-cols-2 xl:grid-cols-3">
          {active.map((order) => (
            <Ticket key={order.id} order={order} onAdvance={advance} />
          ))}
        </div>
      )}
    </div>
  )
}
