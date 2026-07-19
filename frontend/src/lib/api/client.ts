import type { Category, Product } from '../../types/domain'

// The API surface the POS depends on. A mock implementation backs it until the
// backend Menu/POS services land (see issues #4, #7). Swapping to a real HTTP
// client means providing another implementation of this interface.
export interface PosApi {
  getCategories(): Promise<Category[]>
  getProducts(): Promise<Product[]>
}

import { mockCategories, mockProducts } from '../../features/menu/mockMenu'

/** Simulates network latency so loading states are exercised in development. */
function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export const mockApi: PosApi = {
  getCategories: () => delay(mockCategories),
  getProducts: () => delay(mockProducts),
}

// Single access point. Replace with the real client once the backend exists.
export const api: PosApi = mockApi
