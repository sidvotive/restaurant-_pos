import { useMenu } from '../features/menu/MenuStore'
import { useInventory } from '../features/inventory/InventoryStore'
import { LOW_STOCK_THRESHOLD, lowStockItems } from '../features/inventory/lowStock'

export default function InventoryPage() {
  const { categories, products } = useMenu()
  const { stock, setStock } = useInventory()
  const lowCount = lowStockItems(products, stock).length

  function handleChange(productId: string, value: string) {
    if (value === '') {
      setStock(productId, 0)
      return
    }
    const n = Number.parseInt(value, 10)
    if (Number.isFinite(n)) setStock(productId, n)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <h1 className="text-lg font-semibold">Inventory</h1>
        {lowCount > 0 && (
          <span className="rounded-full bg-rose-500/15 px-3 py-1 text-xs font-medium text-rose-300">
            {lowCount} low on stock
          </span>
        )}
      </header>

      {products.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-6 text-center text-slate-500">
          <p>No products yet. Add them in the Menu section, then set stock here.</p>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {categories.map((cat) => {
            const catProducts = products.filter((p) => p.categoryId === cat.id)
            if (catProducts.length === 0) return null
            return (
              <section key={cat.id} className="mb-8">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  {cat.name}
                </h2>
                <ul className="space-y-2">
                  {catProducts.map((p) => {
                    const tracked = p.id in stock
                    const qty = stock[p.id]
                    const low = tracked && qty <= LOW_STOCK_THRESHOLD
                    return (
                      <li
                        key={p.id}
                        className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3"
                      >
                        <span className="min-w-0 flex-1 truncate text-sm text-slate-200">
                          {p.name}
                        </span>
                        {tracked && (
                          <span
                            className={[
                              'rounded-full px-2.5 py-1 text-xs font-medium',
                              qty === 0
                                ? 'bg-rose-500/20 text-rose-300'
                                : low
                                  ? 'bg-amber-500/15 text-amber-300'
                                  : 'bg-emerald-500/15 text-emerald-300',
                            ].join(' ')}
                          >
                            {qty === 0 ? 'Out' : low ? 'Low' : 'In stock'}
                          </span>
                        )}
                        <label className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Stock</span>
                          <input
                            value={tracked ? String(qty) : ''}
                            onChange={(e) => handleChange(p.id, e.target.value)}
                            inputMode="numeric"
                            placeholder="—"
                            aria-label={`Stock for ${p.name}`}
                            className="w-20 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-right text-sm outline-none focus:border-amber-500"
                          />
                        </label>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
