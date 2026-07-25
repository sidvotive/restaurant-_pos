import { formatMinor } from '../lib/money'
import { useOrders } from '../features/orders/OrdersStore'
import { summarizeCustomers } from '../features/customers/customerReport'

const DATE_FMT = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' })

export default function CustomersPage() {
  const { orders } = useOrders()
  const customers = summarizeCustomers(orders)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <h1 className="text-lg font-semibold">Customers</h1>
        {customers.length > 0 && (
          <span className="text-xs text-slate-500">{customers.length} total</span>
        )}
      </header>

      {customers.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-6 text-center text-slate-500">
          <p>No customers yet. Add a name or phone to an order in the POS.</p>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {customers.map((c) => (
              <li
                key={c.key}
                className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-100">{c.name}</p>
                  {c.phone && <p className="text-xs text-slate-500">{c.phone}</p>}
                </div>
                <span className="text-xs text-slate-400">
                  {c.visits} visit{c.visits === 1 ? '' : 's'}
                </span>
                <span
                  className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-300"
                  title="Loyalty points"
                >
                  {c.points} pts
                </span>
                <span className="hidden text-xs text-slate-500 sm:inline">
                  {DATE_FMT.format(new Date(c.lastOrderAt))}
                </span>
                <span className="w-24 text-right text-sm font-semibold text-amber-300">
                  {formatMinor(c.totalSpentMinor)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
