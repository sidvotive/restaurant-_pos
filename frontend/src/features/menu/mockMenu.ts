import type { Category, Product } from '../../types/domain'

// Placeholder menu data. Replaced by the Menu service (issue #4).

export const mockCategories: Category[] = [
  { id: 'starters', name: 'Starters' },
  { id: 'mains', name: 'Mains' },
  { id: 'breads', name: 'Breads' },
  { id: 'drinks', name: 'Drinks' },
  { id: 'desserts', name: 'Desserts' },
]

export const mockProducts: Product[] = [
  { id: 'p1', categoryId: 'starters', name: 'Paneer Tikka', priceMinor: 28000 },
  { id: 'p2', categoryId: 'starters', name: 'Veg Spring Roll', priceMinor: 22000 },
  { id: 'p3', categoryId: 'mains', name: 'Butter Chicken', priceMinor: 42000 },
  { id: 'p4', categoryId: 'mains', name: 'Dal Makhani', priceMinor: 32000 },
  { id: 'p5', categoryId: 'mains', name: 'Veg Biryani', priceMinor: 36000 },
  { id: 'p6', categoryId: 'breads', name: 'Butter Naan', priceMinor: 8000 },
  { id: 'p7', categoryId: 'breads', name: 'Garlic Naan', priceMinor: 9000 },
  { id: 'p8', categoryId: 'drinks', name: 'Masala Chai', priceMinor: 6000 },
  { id: 'p9', categoryId: 'drinks', name: 'Fresh Lime Soda', priceMinor: 9000 },
  { id: 'p10', categoryId: 'desserts', name: 'Gulab Jamun', priceMinor: 12000 },
  { id: 'p11', categoryId: 'desserts', name: 'Kulfi', priceMinor: 14000 },
]
