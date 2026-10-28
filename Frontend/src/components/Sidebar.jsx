import Icon from './Icon.jsx'

const navigation = [['Dashboard', 'home'], ['My Tasks', 'tasks'], ['Create Task', 'plus'], ['Calendar', 'calendar'], ['Settings', 'settings']]
const filters = [['All Tasks', 'all', 'tasks'], ['Pending', 'pending', 'tasks'], ['In Progress', 'in-progress', 'clock'], ['Completed', 'completed', 'check']]

export default function Sidebar({ activeNav, activeFilter, counts, displayName, onNavigate, onFilter, onLogout }) {
  const firstName = displayName.split(/[ .@_-]/)[0]
  const initial = firstName.slice(0, 1).toUpperCase()

  return (
    <aside className="z-20 flex w-full shrink-0 flex-col border-b border-slate-800 bg-[#0b1322] px-4 py-4 lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-b-0 lg:border-r lg:px-5">
      <a
        className="mb-5 flex items-center gap-3 text-lg font-bold tracking-tight text-white"
        href="#"
        onClick={(event) => { event.preventDefault(); onNavigate('Dashboard') }}
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-700 text-white shadow-lg shadow-indigo-950/50">
          <Icon name="check" size={20} />
        </span>
        <span>Task<span className="text-indigo-300">Flow</span></span>
      </a>

      <nav className="flex gap-1 overflow-x-auto pb-2 lg:grid lg:gap-1 lg:overflow-visible lg:pb-0" aria-label="Main navigation">
        {navigation.map(([label, icon]) => (
          <button
            key={label}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
              activeNav === label ? 'bg-indigo-500/15 font-semibold text-indigo-200 ring-1 ring-inset ring-indigo-400/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
            onClick={() => onNavigate(label)}
          >
            <Icon name={icon} size={17} />{label}
          </button>
        ))}
      </nav>

      <div className="mt-5 hidden lg:block">
        <p className="mb-2 px-3 text-[11px] font-bold tracking-[0.16em] text-slate-600">FILTERS</p>
        <div className="grid gap-1">
          {filters.map(([label, filter, icon]) => {
            const count = filter === 'all' ? counts.total
              : filter === 'pending' ? counts.pending
                : filter === 'in-progress' ? counts.progress : counts.completed
            return (
              <button
                key={filter}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                  activeFilter === filter ? 'bg-white/5 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => onFilter(filter)}
              >
                <Icon name={icon} size={16} className="text-slate-500" />
                <span className="flex-1">{label}</span>
                <span className={`min-w-7 rounded-full px-2 py-0.5 text-center text-xs font-semibold ${
                  filter === 'pending' ? 'bg-amber-400/10 text-amber-300'
                    : filter === 'completed' ? 'bg-emerald-400/10 text-emerald-300'
                      : 'bg-indigo-400/10 text-indigo-300'
                }`}>{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-auto hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-indigo-950/40 p-4 lg:block">
        <div className="mb-2 flex h-8 items-end gap-1" aria-hidden="true">
          <span className="h-4 w-4 rotate-45 rounded-sm bg-indigo-600/80" />
          <span className="h-7 w-7 rotate-45 rounded-sm bg-indigo-400/80" />
          <span className="h-3 w-3 rotate-45 rounded-sm bg-indigo-700/80" />
        </div>
        <p className="text-sm leading-6 text-slate-300">Stay consistent,<br />small steps create<br />big results.</p>
      </div>

      <div className="mt-4 flex items-center gap-3 border-t border-slate-800 pt-4 lg:mt-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 text-sm font-bold text-white">{initial}</span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-200">{displayName}</span>
        <button className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white" title="Sign out" aria-label="Sign out" onClick={onLogout}>
          <Icon name="logout" size={17} />
        </button>
      </div>
    </aside>
  )
}
