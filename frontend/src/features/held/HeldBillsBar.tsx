import { formatMinor } from '../../lib/money'
import { computeTotals } from '../cart/cartTotals'
import { useCart } from '../cart/CartContext'
import { useTables } from '../tables/TablesStore'
import { useHeldBills } from './HeldBillsStore'

export default function HeldBillsBar() {
  const { bills, resume, remove } = useHeldBills()
  const { loadBill } = useCart()
  const { select } = useTables()

  if (bills.length === 0) return null

  function onResume(id: string) {
    const bill = resume(id)
    if (!bill) return
    loadBill(bill)
    if (bill.tableId) select(bill.tableId)
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 bg-slate-900/40 px-4 py-2">
      <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-slate-500">
        Held
      </span>
      {bills.map((bill) => {
        const items = bill.lines.reduce((n, l) => n + l.quantity, 0)
        const total = computeTotals(bill.lines, {
          discountMinor: bill.discountMinor,
          tipMinor: bill.tipMinor,
        }).totalMinor
        return (
          <div
            key={bill.id}
            className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs"
          >
            <button
              type="button"
              onClick={() => onResume(bill.id)}
              className="font-medium text-amber-300 hover:text-amber-200"
            >
              {bill.tableLabel ?? `${items} item${items === 1 ? '' : 's'}`} · {formatMinor(total)}
            </button>
            <button
              type="button"
              aria-label="Discard held bill"
              onClick={() => remove(bill.id)}
              className="text-slate-500 hover:text-rose-400"
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}
