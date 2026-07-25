import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { Category, Product } from '../../types/domain'
import { loadJson, saveJson } from '../../lib/persist'
import { menuClient } from '../../lib/api/menuClient'
import { useAuth } from '../auth/AuthContext'
import { menuReducer, type MenuState } from './menuReducer'
import { mockCategories, mockProducts } from './mockMenu'

const STORAGE_KEY = 'rpos.menu'
// Full-stack by default; VITE_USE_MOCK_AUTH=true keeps menu on localStorage.
const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

interface MenuContextValue {
  categories: Category[]
  products: Product[]
  addCategory: (name: string) => void
  renameCategory: (id: string, name: string) => void
  removeCategory: (id: string) => void
  addProduct: (categoryId: string, name: string, priceMinor: number) => void
  updateProduct: (product: Product) => void
  removeProduct: (id: string) => void
}

const MenuContext = createContext<MenuContextValue | null>(null)

const emptyState: MenuState = { categories: [], products: [] }
const mockSeed: MenuState = { categories: mockCategories, products: mockProducts }

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)
}

export function MenuProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [state, dispatch] = useReducer(
    menuReducer,
    USE_MOCK ? mockSeed : emptyState,
    (init): MenuState => (USE_MOCK ? loadJson<MenuState>(STORAGE_KEY, init) : init),
  )

  // Mock mode: persist to localStorage.
  useEffect(() => {
    if (USE_MOCK) saveJson(STORAGE_KEY, state)
  }, [state])

  // Full-stack mode: load the tenant's menu once authenticated (and clear on logout).
  useEffect(() => {
    if (USE_MOCK) return
    let cancelled = false
    if (!isAuthenticated) {
      dispatch({ type: 'load', state: emptyState })
      return
    }
    menuClient
      .getMenu()
      .then((menu) => {
        if (!cancelled) dispatch({ type: 'load', state: { categories: menu.categories, products: menu.products } })
      })
      .catch(() => {
        /* leave the menu empty; the admin can add items */
      })
    return () => {
      cancelled = true
    }
  }, [isAuthenticated])

  const value = useMemo<MenuContextValue>(() => {
    async function refetch() {
      const menu = await menuClient.getMenu()
      dispatch({ type: 'load', state: { categories: menu.categories, products: menu.products } })
    }

    if (USE_MOCK) {
      return {
        categories: state.categories,
        products: state.products,
        addCategory: (name) =>
          dispatch({ type: 'addCategory', category: { id: newId(), name: name.trim() } }),
        renameCategory: (id, name) => dispatch({ type: 'renameCategory', id, name: name.trim() }),
        removeCategory: (id) => dispatch({ type: 'removeCategory', id }),
        addProduct: (categoryId, name, priceMinor) =>
          dispatch({
            type: 'addProduct',
            product: { id: newId(), categoryId, name: name.trim(), priceMinor },
          }),
        updateProduct: (product) => dispatch({ type: 'updateProduct', product }),
        removeProduct: (id) => dispatch({ type: 'removeProduct', id }),
      }
    }

    // Full-stack: mutate through the API, then refetch. Errors surface in the console.
    return {
      categories: state.categories,
      products: state.products,
      addCategory: (name) => void menuClient.addCategory(name.trim()).then(refetch),
      renameCategory: (id, name) => void menuClient.renameCategory(id, name.trim()).then(refetch),
      removeCategory: (id) => void menuClient.removeCategory(id).then(refetch),
      addProduct: (categoryId, name, priceMinor) =>
        void menuClient.addProduct(categoryId, name.trim(), priceMinor).then(refetch),
      updateProduct: (product) => void menuClient.updateProduct(product).then(refetch),
      removeProduct: (id) => void menuClient.removeProduct(id).then(refetch),
    }
  }, [state])

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMenu(): MenuContextValue {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error('useMenu must be used within a MenuProvider')
  return ctx
}
