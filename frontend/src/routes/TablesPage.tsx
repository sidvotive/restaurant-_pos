import { useNavigate } from 'react-router-dom'
import type { RestaurantTable, TableStatus } from '../types/domain'
import { useTables } from '../features/tables/TablesStore'
import { groupByArea, summarize } from '../features/tables/tablesReducer'

const STATUS_STYLES: Record<TableStatus, string> = {
  free: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20',
  occupied: 'border-rose-500/40 bg-rose-500/10 text-rose-200',
  reserved: 'border-sky-500/40 bg-sky-500/10 text-sky-200',
}

function TableCard({
  table,
  isSelected,
  onSelect,
  onFree,
}: {
  table: RestaurantTable
  isSelected: boolean
  onSelect: () => void
  onFree: () => void
}) {
  const clickable = table.status === 'free'
  return (
    <div
      className={[
        'flex flex-col rounded-2xl border p-4 transition-colors',
        STATUS_STYLES[table.status],
        isSelected ? 'ring-2 ring-amber-400' : '',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={onSelect}
        disabled={!clickable}
        className="flex items-baseline justify-between text-left disabled:cursor-default"
      >
        <span className="text-lg font-bold text-slate-100">{table.label}</span>
        <span className="text-xs text-slate-400">{table.seats} seats</span>
      </button>
      <span className="mt-2 text-xs font-medium capitalize">{table.status}</span>
      {table.status !== 'free' && (
        <button
          type="button"
          onClick={onFree}
          className="mt-3 rounded-lg bg-slate-800 px-2 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700"
        >
          Free table
        </button>
      )}
    </div>
  )
}

export default function TablesPage() {
  const { tables, selectedTableId, select, setStatus } = useTables()
  const navigate = useNavigate()
  const summary = summarize(tables)

  function handleSelect(table: RestaurantTable) {
    select(table.id)
    navigate('/') // take the waiter to the POS to build the order
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <h1 className="text-lg font-semibold">Tables</h1>
        <div className="flex gap-4 text-xs text-slate-400">
          <span><span className="text-emerald-300">{summary.free}</span> free</span>
          <span><span className="text-rose-300">{summary.occupied}</span> occupied</span>
          <span><span className="text-sky-300">{summary.reserved}</span> reserved</span>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        {groupByArea(tables).map((group) => (
          <section key={group.area} className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              {group.area}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
              {group.tables.map((table) => (
                <TableCard
                  key={table.id}
                  table={table}
                  isSelected={table.id === selectedTableId}
                  onSelect={() => handleSelect(table)}
                  onFree={() => setStatus(table.id, 'free')}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
