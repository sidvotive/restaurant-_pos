import { NavLink, Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../features/auth/AuthContext'

interface NavItem {
  to: string
  label: string
  icon: string
}

const navItems: NavItem[] = [
  { to: '/', label: 'POS', icon: '🧾' },
  { to: '/orders', label: 'Orders', icon: '📋' },
  { to: '/kds', label: 'Kitchen', icon: '👨‍🍳' },
  { to: '/tables', label: 'Tables', icon: '🍽️' },
  { to: '/menu', label: 'Menu', icon: '📖' },
  { to: '/reports', label: 'Reports', icon: '📊' },
]

function SideNav() {
  return (
    <nav className="flex flex-col gap-1 p-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            [
              'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors',
              isActive
                ? 'bg-amber-500/15 text-amber-300'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100',
            ].join(' ')
          }
        >
          <span className="text-lg" aria-hidden>
            {item.icon}
          </span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

/** Bottom tab bar shown on small screens where the sidebar is hidden. */
function BottomNav({ onSignOut }: { onSignOut: () => void }) {
  const itemClass = 'flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium'
  return (
    <nav className="flex border-t border-slate-800 bg-slate-900/80 sm:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            [itemClass, isActive ? 'text-amber-300' : 'text-slate-400'].join(' ')
          }
        >
          <span className="text-lg" aria-hidden>
            {item.icon}
          </span>
          <span>{item.label}</span>
        </NavLink>
      ))}
      <button type="button" onClick={onSignOut} className={`${itemClass} text-slate-400`}>
        <span className="text-lg" aria-hidden>
          ⏻
        </span>
        <span>Sign out</span>
      </button>
    </nav>
  )
}

export default function AppShell(): ReactNode {
  const { session, logout } = useAuth()

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-slate-100 sm:flex-row">
      <aside className="hidden w-56 shrink-0 border-r border-slate-800 bg-slate-900/60 sm:flex sm:flex-col">
        <div className="px-4 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Restaurant POS
          </p>
          <p className="mt-1 text-sm text-slate-400">Main Branch</p>
        </div>
        <SideNav />
        <div className="mt-auto border-t border-slate-800 p-3">
          {session && (
            <p className="truncate px-1 pb-2 text-xs text-slate-400" title={session.email}>
              {session.email}
              <span className="ml-1 text-slate-600">· {session.role}</span>
            </p>
          )}
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Outlet />
      </main>

      <BottomNav onSignOut={logout} />
    </div>
  )
}
