import { useStaff } from '../features/staff/StaffStore'
import { formatDuration, openShiftFor, workedMinutes } from '../features/staff/attendance'

const TIME_FMT = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' })

export default function StaffPage() {
  const { employees, shifts, clockIn, clockOut } = useStaff()
  const now = Date.now()
  const onDuty = employees.filter((e) => openShiftFor(shifts, e.id)).length

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <h1 className="text-lg font-semibold">Staff</h1>
        <span className="text-xs text-slate-500">{onDuty} on duty</span>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {employees.map((e) => {
            const open = openShiftFor(shifts, e.id)
            const minutes = workedMinutes(shifts, e.id, now)
            return (
              <li
                key={e.id}
                className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-100">{e.name}</p>
                  <p className="text-xs text-slate-500">{e.role}</p>
                </div>

                {open ? (
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                    In since {TIME_FMT.format(new Date(open.clockInAt))}
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-700/40 px-3 py-1 text-xs font-medium text-slate-400">
                    Off
                  </span>
                )}

                <span className="w-16 text-right text-xs text-slate-400">
                  {formatDuration(minutes)}
                </span>

                <button
                  type="button"
                  onClick={() => (open ? clockOut(e.id) : clockIn(e.id))}
                  className={[
                    'w-24 rounded-lg px-3 py-2 text-sm font-semibold',
                    open
                      ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      : 'bg-amber-500 text-slate-950 hover:bg-amber-400',
                  ].join(' ')}
                >
                  {open ? 'Clock out' : 'Clock in'}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
