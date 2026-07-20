import { useEffect, useState, type FormEvent } from 'react'
import { formatMinor, parseAmountToMinor } from '../lib/money'
import { useMenu } from '../features/menu/MenuStore'

interface ProductDraft {
  id: string | null
  name: string
  price: string
}

const emptyProduct: ProductDraft = { id: null, name: '', price: '' }

export default function MenuPage() {
  const {
    categories,
    products,
    addCategory,
    renameCategory,
    removeCategory,
    addProduct,
    updateProduct,
    removeProduct,
  } = useMenu()

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    categories[0]?.id ?? null,
  )
  const [newCategory, setNewCategory] = useState('')
  const [renameDraft, setRenameDraft] = useState('')
  const [product, setProduct] = useState<ProductDraft>(emptyProduct)
  const [error, setError] = useState<string | null>(null)

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) ?? null

  // Keep the selection valid and the rename field in sync as categories change.
  useEffect(() => {
    if (categories.length === 0) {
      setSelectedCategoryId(null)
    } else if (!categories.some((c) => c.id === selectedCategoryId)) {
      setSelectedCategoryId(categories[0].id)
    }
  }, [categories, selectedCategoryId])

  useEffect(() => {
    setRenameDraft(selectedCategory?.name ?? '')
    setProduct(emptyProduct)
    setError(null)
  }, [selectedCategoryId, selectedCategory?.name])

  const categoryProducts = products.filter((p) => p.categoryId === selectedCategoryId)

  function handleAddCategory(e: FormEvent) {
    e.preventDefault()
    if (newCategory.trim()) {
      addCategory(newCategory)
      setNewCategory('')
    }
  }

  function handleSaveProduct(e: FormEvent) {
    e.preventDefault()
    if (!selectedCategoryId) return
    if (!product.name.trim()) {
      setError('Product name is required.')
      return
    }
    const priceMinor = parseAmountToMinor(product.price)
    if (priceMinor === null) {
      setError('Enter a valid price (e.g. 250 or 250.50).')
      return
    }
    if (product.id) {
      updateProduct({ id: product.id, categoryId: selectedCategoryId, name: product.name.trim(), priceMinor })
    } else {
      addProduct(selectedCategoryId, product.name, priceMinor)
    }
    setProduct(emptyProduct)
    setError(null)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-b border-slate-800 px-6 py-4">
        <h1 className="text-lg font-semibold">Menu</h1>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* Categories */}
        <div className="border-b border-slate-800 p-4 md:w-64 md:shrink-0 md:border-b-0 md:border-r">
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category"
              className="min-w-0 flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              aria-label="Add category"
              className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700"
            >
              Add
            </button>
          </form>
          <ul className="mt-3 space-y-1">
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={[
                    'w-full rounded-lg px-3 py-2 text-left text-sm',
                    cat.id === selectedCategoryId
                      ? 'bg-amber-500/15 text-amber-300'
                      : 'text-slate-300 hover:bg-slate-800',
                  ].join(' ')}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Products in the selected category */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {selectedCategory ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  value={renameDraft}
                  onChange={(e) => setRenameDraft(e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => renameDraft.trim() && renameCategory(selectedCategory.id, renameDraft)}
                  className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700"
                >
                  Rename
                </button>
                <button
                  type="button"
                  onClick={() => removeCategory(selectedCategory.id)}
                  className="rounded-lg bg-rose-500/15 px-3 py-2 text-sm font-medium text-rose-300 hover:bg-rose-500/25"
                >
                  Delete category
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="mt-4 flex flex-wrap items-end gap-2">
                <label className="min-w-0 flex-1">
                  <span className="text-xs text-slate-500">Product name</span>
                  <input
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-amber-500"
                  />
                </label>
                <label className="w-28">
                  <span className="text-xs text-slate-500">Price (₹)</span>
                  <input
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                    inputMode="decimal"
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-amber-500"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400"
                >
                  {product.id ? 'Update' : 'Add'}
                </button>
                {product.id && (
                  <button
                    type="button"
                    onClick={() => setProduct(emptyProduct)}
                    className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                )}
              </form>
              {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}

              <ul className="mt-4 space-y-2">
                {categoryProducts.length === 0 && (
                  <li className="text-sm text-slate-500">No products in this category yet.</li>
                )}
                {categoryProducts.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm">{p.name}</span>
                    <span className="text-sm text-amber-300">{formatMinor(p.priceMinor)}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setProduct({ id: p.id, name: p.name, price: (p.priceMinor / 100).toString() })
                      }
                      className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:bg-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeProduct(p.id)}
                      className="rounded-md bg-slate-800 px-2 py-1 text-xs text-rose-300 hover:bg-slate-700"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-slate-500">Add a category to start building the menu.</p>
          )}
        </div>
      </div>
    </div>
  )
}
