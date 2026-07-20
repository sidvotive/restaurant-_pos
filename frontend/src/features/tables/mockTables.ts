import type { RestaurantTable } from '../../types/domain'

// Placeholder floor layout. Replaced by the Tables service / floor designer (#5).
export const mockTables: RestaurantTable[] = [
  { id: 't1', label: 'T1', area: 'Ground Floor', seats: 2, status: 'free' },
  { id: 't2', label: 'T2', area: 'Ground Floor', seats: 2, status: 'free' },
  { id: 't3', label: 'T3', area: 'Ground Floor', seats: 4, status: 'free' },
  { id: 't4', label: 'T4', area: 'Ground Floor', seats: 4, status: 'reserved' },
  { id: 't5', label: 'T5', area: 'Ground Floor', seats: 6, status: 'free' },
  { id: 't6', label: 'B1', area: 'Terrace', seats: 2, status: 'free' },
  { id: 't7', label: 'B2', area: 'Terrace', seats: 4, status: 'free' },
  { id: 't8', label: 'B3', area: 'Terrace', seats: 4, status: 'free' },
]
