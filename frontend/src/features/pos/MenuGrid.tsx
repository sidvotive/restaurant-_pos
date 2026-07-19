import { useEffect, useMemo, useState } from 'react'
import type { Category, Product } from '../../types/domain'
import { api } from '../../lib/api/client'
import { formatMinor } from '../../lib/money'
import { useCart } from '../cart/CartContext'

export default function MenuGrid() {
  const { add } = useCart()
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([api.getCategories(), api.getProducts()]).then(([cats, prods]) => {
      if (cancelled) return
      setCategories(cats)
      setProducts(prods)
      setActiveCategory(cats[0]?.id ?? null)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const visibleProducts = useMemo(
    () => products.filter((p) => p.categoryId === activeCategory),
    [products, activeCategory],
  )

  if (loading) {
    return <div className="p-6 text-slate-400">Loading menu…</div>
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
