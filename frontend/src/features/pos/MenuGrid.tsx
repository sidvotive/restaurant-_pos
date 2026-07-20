import { useEffect, useMemo, useState } from 'react'
import { formatMinor } from '../../lib/money'
import { useCart } from '../cart/CartContext'
import { useMenu } from '../menu/MenuStore'

export default function MenuGrid() {
  const { add } = useCart()
  const { categories, products } = useMenu()
  const [activeCategory, setActiveCategory] = useState<string | null>(categories[0]?.id ?? null)

  // Keep the active tab valid as categories are added/removed in Menu admin.
  useEffect(() => {
    if (categories.length === 0) {
      setActiveCategory(null)
    } else if (!categories.some((c) => c.id === activeCategory)) {
      setActiveCategory(categories[0].id)
    }
  }, [categories, activeCategory])

  const visibleProducts = useMemo(
    () => products.filter((p) => p.categoryId === activeCategory),
    [products, activeCategory],
  )

  if (categories.length === 0) {
    return (
      <div className="p-6 text-slate-400">
        No menu yet. Add categories and products in the Menu section.
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex gap-2 overflow-x-auto border-b border-slate-800 px-4 py-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={[
              'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
              cat.id === activeCategory
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700',
            ].join(' ')}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-2 content-start gap-3 overflow-y-auto p-4 md:grid-cols-3 xl:grid-cols-4">
        {visibleProducts.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => add(product)}
            className="flex flex-col items-start rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-left transition-colors hover:border-amber-500/40 hover:bg-slate-800"
          >
            <span className="text-sm font-semibold">{product.name}</span>
            <span className="mt-2 text-amber-300">{formatMinor(product.priceMinor)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
