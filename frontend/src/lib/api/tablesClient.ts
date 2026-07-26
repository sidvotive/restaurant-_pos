import type { RestaurantTable, TableStatus } from '../../types/domain'
import { apiFetch } from './http'

interface TableDto {
  id: string
  label: string
  area: string
  seats: number
  status: string
  reservedFor?: string | null
}

function toTable(dto: TableDto): RestaurantTable {
  return {
    id: dto.id,
    label: dto.label,
    area: dto.area,
    seats: dto.seats,
    status: dto.status as TableStatus,
    reservedFor: dto.reservedFor ?? undefined,
  }
}

// Talks to the Tables module (tenant-scoped; requires an authenticated session).
// The server seeds a default floor layout on first access, so the list is never empty.
export const tablesClient = {
  getTables: async (): Promise<RestaurantTable[]> =>
    (await apiFetch<TableDto[]>('/api/tables/')).map(toTable),
  setStatus: async (tableId: string, status: TableStatus): Promise<RestaurantTable> =>
    toTable(await apiFetch<TableDto>(`/api/tables/${tableId}/status`, { method: 'PUT', body: { status } })),
  reserve: async (tableId: string, name: string): Promise<RestaurantTable> =>
    toTable(await apiFetch<TableDto>(`/api/tables/${tableId}/reserve`, { method: 'POST', body: { name } })),
}
