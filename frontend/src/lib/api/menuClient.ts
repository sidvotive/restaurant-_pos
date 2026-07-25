import type { Category, Product } from '../../types/domain'
import { apiFetch } from './http'

export interface MenuDto {
  categories: Category[]
  products: Product[]
}

// Talks to the Menu module (tenant-scoped; requires an authenticated session).
export const menuClient = {
  getMenu: () => apiFetch<MenuDto>('/api/menu/'),
  addCategory: (name: string) =>
    apiFetch<Category>('/api/menu/categories', { method: 'POST', body: { name } }),
  renameCategory: (id: string, name: string) =>
    apiFetch<void>(`/api/menu/categories/${id}`, { method: 'PUT', body: { name } }),
  removeCategory: (id: string) =>
    apiFetch<void>(`/api/menu/categories/${id}`, { method: 'DELETE' }),
  addProduct: (categoryId: string, name: string, priceMinor: number) =>
    apiFetch<Product>('/api/menu/products', { method: 'POST', body: { categoryId, name, priceMinor } }),
  updateProduct: (product: Product) =>
    apiFetch<void>(`/api/menu/products/${product.id}`, {
      method: 'PUT',
      body: { categoryId: product.categoryId, name: product.name, priceMinor: product.priceMinor },
    }),
  removeProduct: (id: string) =>
    apiFetch<void>(`/api/menu/products/${id}`, { method: 'DELETE' }),
}
