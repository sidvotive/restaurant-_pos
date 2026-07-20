import type { OrderStatus } from '../../types/domain'

interface StatusMeta {
  label: string
  /** Tailwind classes for a status badge. */
  badge: string
  /** Label for the button that advances the order out of this status. */
  advanceLabel: string
}

export const STATUS_META: Record<OrderStatus, StatusMeta> = {
  placed: {
    label: 'Placed',
    badge: 'bg-sky-500/15 text-sky-300',
    advanceLabel: 'Start preparing',
  },
  preparing: {
    label: 'Preparing',
    badge: 'bg-amber-500/15 text-amber-300',
    advanceLabel: 'Mark ready',
  },
  ready: {
    label: 'Ready',
    badge: 'bg-emerald-500/15 text-emerald-300',
    advanceLabel: 'Serve',
  },
  served: {
    label: 'Served',
    badge: 'bg-slate-600/30 text-slate-300',
    advanceLabel: '',
  },
}
