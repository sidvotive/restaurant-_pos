import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { Category, Product } from '../../types/domain'
import { loadJson, saveJson } from '../../lib/persist'
import { menuReducer, type MenuState } from './menuReducer'
import { mockCategories, mockProducts } from './mockMenu'

const STORAGE_KEY = 'rpos.menu'

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

const initialState: MenuState = { categories: mockCategories, products: mockProducts }

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)
}

export function MenuProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    menuReducer,
    initialState,
    (init): MenuState => loadJson<MenuState>(STORAGE_KEY, init),
  )

  useEffect(() => {
    saveJson(STORAGE_KEY, state)
  }, [state])

  const value = useMemo<MenuContextValue>(
    () => ({
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
    }),
    [state],
  )

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMenu(): MenuContextValue {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error('useMenu must be used within a MenuProvider')
  return ctx
}
