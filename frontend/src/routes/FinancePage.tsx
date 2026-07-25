import { useState, type FormEvent } from 'react'
import { formatMinor, parseAmountToMinor } from '../lib/money'
import { useOrders } from '../features/orders/OrdersStore'
import { useExpenses } from '../features/finance/ExpensesStore'
import { totalExpensesMinor } from '../features/finance/expensesReducer'
import { summarizeSales } from '../features/reports/salesReport'

const DATE_FMT = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' })

function Tile({ label, value, tone }: { label: string; value: string; tone?: 'good' | 'bad' }) {
  const valueColor =
    tone === 'good' ? 'text-emerald-300' : tone === 'bad' ? 'text-rose-300' : 'text-slate-100'
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${valueColor}`}>{value}</p>
    </div>
  )
}

export default function FinancePage() {
  const { orders } = useOrders()
  const { expenses, add, remove } = useExpenses()
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string | null>(null)

  const salesMinor = summarizeSales(orders).totalSalesMinor
  const expensesMinor = totalExpensesMinor(expenses)
  const netMinor = salesMinor - expensesMinor

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!label.trim()) {
      setError('Description is required.')
      return
    }
    const amountMinor = parseAmountToMinor(amount)
    if (amountMinor === null || amountMinor === 0) {
      setError('Enter a valid amount (e.g. 500 or 500.50).')
      return
    }
    add(label, amountMinor)
    setLabel('')
    setAmount('')
    setError(null)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-b border-slate-800 px-6 py-4">
        <h1 className="text-lg font-semibold">Finance</h1>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Tile label="Sales" value={formatMinor(salesMinor)} />
          <Tile label="Expenses" value={formatMinor(expensesMinor)} />
          <Tile
            label="Net"
            value={formatMinor(netMinor)}
            tone={netMinor >= 0 ? 'good' : 'bad'}
          />
        </div>

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Add expense
          </h2>
          <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-2">
            <label className="min-w-0 flex-1">
              <span className="text-xs text-slate-500">Description</span>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Vegetables, Gas cylinder"
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-amber-500"
              />
            </label>
            <label className="w-32">
              <span className="text-xs text-slate-500">Amount (₹)</span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-amber-500"
              />
            </label>
            <button
              type="submit"
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400"
            >
              Add
            </button>
          </form>
          {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Expenses
          </h2>
          {expenses.length === 0 ? (
            <p className="text-sm text-slate-500">No expenses recorded yet.</p>
          ) : (
            <ul className="space-y-2">
              {expenses.map((exp) => (
                <li
                  key={exp.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3"
                >
                  <span className="min-w-0 flex-1 truncate text-sm text-slate-200">{exp.label}</span>
                  <span className="text-xs text-slate-500">
                    {DATE_FMT.format(new Date(exp.at))}
                  </span>
                  <span className="w-24 text-right text-sm font-medium text-rose-300">
                    −{formatMinor(exp.amountMinor)}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${exp.label}`}
                    onClick={() => remove(exp.id)}
                    className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400 hover:bg-slate-700 hover:text-rose-300"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
