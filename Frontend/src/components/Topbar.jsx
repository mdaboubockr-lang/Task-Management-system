import Icon from './Icon.jsx'

export default function Topbar({ search, setSearch, displayName, onLogout }) {
  const initial = displayName.split(/[ .@_-]/)[0].slice(0, 1).toUpperCase()

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-slate-800/80 bg-[#070d19]/90 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
      <label className="flex h-10 w-full max-w-xl items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-3 text-slate-500 transition focus-within:border-indigo-400/60">
        <Icon name="search" size={17} />
        <input
          id="global-search"
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
          placeholder="Search tasks..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <kbd className="hidden rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] text-slate-400 sm:inline">Ctrl + K</kbd>
      </label>
      <div className="flex shrink-0 items-center gap-3">
        <span className="hidden text-sm font-medium text-slate-300 sm:inline">{displayName}</span>
        <button
          className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 text-sm font-bold text-white"
          title="Sign out"
          aria-label="Sign out"
          onClick={onLogout}
        >{initial}</button>
      </div>
    </header>
  )
}
