import type { OrderType } from '../../types/domain'
import { formatMinor } from '../../lib/money'
import { lineTotalMinor } from '../cart/cartTotals'
import { useCart } from '../cart/CartContext'

const ORDER_TYPES: { value: OrderType; label: string }[] = [
  { value: 'dine-in', label: 'Dine-in' },
  { value: 'takeaway', label: 'Takeaway' },
  { value: 'delivery', label: 'Delivery' },
]

export default function CartPanel() {
  const { lines, totals, orderType, itemCount, add, decrement, clear, setOrderType } = useCart()

  return (
    <aside className="flex w-full max-w-sm flex-col border-l border-slate-800 bg-slate-900/60">
      <div className="border-b border-slate-800 p-4">
        <div className="flex gap-2">
          {ORDER_TYPES.map((ot) => (
            <button
              key={ot.value}
              type="button"
              onClick={() => setOrderType(ot.value)}
              className={[
                'flex-1 rounded-lg px-2 py-2 text-xs font-semibold transition-colors',
                ot.value === orderType
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700',
              ].join(' ')}
            >
              {ot.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {lines.length === 0 ? (
          <p className="mt-8 text-center text-sm text-slate-500">
            No items yet. Tap a product to add it.
          </p>
        ) : (
          <ul className="space-y-2">
            {lines.map((line) => (
              <li
                key={line.product.id}
                className="flex items-center gap-3 rounded-xl bg-slate-800/60 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{line.product.name}</p>
                  <p className="text-xs text-slate-400">
                    {formatMinor(line.product.priceMinor)} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Decrease ${line.product.name}`}
                    onClick={() => decrement(line.product.id)}
                    className="h-7 w-7 rounded-md bg-slate-700 text-slate-100 hover:bg-slate-600"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm">{line.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Increase ${line.product.name}`}
                    onClick={() => add(line.product)}
                    className="h-7 w-7 rounded-md bg-slate-700 text-slate-100 hover:bg-slate-600"
                  >
                    +
                  </button>
                </div>
                <span className="w-20 text-right text-sm font-semibold">
                  {formatMinor(lineTotalMinor(line))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-slate-800 p-4">
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between text-slate-400">
            <dt>Subtotal</dt>
            <dd>{formatMinor(totals.subtotalMinor)}</dd>
          </div>
          <div className="flex justify-between text-slate-400">
            <dt>Tax</dt>
            <dd>{formatMinor(totals.taxMinor)}</dd>
          </div>
          <div className="flex justify-between text-base font-semibold text-slate-100">
            <dt>Total</dt>
            <dd>{formatMinor(totals.totalMinor)}</dd>
          </div>
        </dl>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={clear}
            disabled={itemCount === 0}
            className="rounded-xl bg-slate-800 px-4 py-3 text-sm font-medium text-slate-300 disabled:opacity-40 hover:bg-slate-700"
          >
            Clear
          </button>
          <button
            type="button"
            disabled={itemCount === 0}
            className="flex-1 rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-40 hover:bg-amber-400"
          >
            Charge {formatMinor(totals.totalMinor)}
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-slate-500">
          Billing is wired to mock data pending the POS/Billing API (issue #7).
        </p>
      </div>
    </aside>
  )
}
