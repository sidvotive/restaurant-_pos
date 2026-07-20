import type { Category, Product } from '../../types/domain'

export interface MenuState {
  categories: Category[]
  products: Product[]
}

export type MenuAction =
  | { type: 'addCategory'; category: Category }
  | { type: 'renameCategory'; id: string; name: string }
  | { type: 'removeCategory'; id: string }
  | { type: 'addProduct'; product: Product }
  | { type: 'updateProduct'; product: Product }
  | { type: 'removeProduct'; id: string }

export function menuReducer(state: MenuState, action: MenuAction): MenuState {
  switch (action.type) {
    case 'addCategory':
      return { ...state, categories: [...state.categories, action.category] }

    case 'renameCategory':
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.id ? { ...c, name: action.name } : c,
        ),
      }

    case 'removeCategory':
      // Removing a category also removes its products.
      return {
        categories: state.categories.filter((c) => c.id !== action.id),
        products: state.products.filter((p) => p.categoryId !== action.id),
      }

    case 'addProduct':
      return { ...state, products: [...state.products, action.product] }

    case 'updateProduct':
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.product.id ? action.product : p,
        ),
      }

    case 'removeProduct':
      return { ...state, products: state.products.filter((p) => p.id !== action.id) }

    default:
      return state
  }
}
