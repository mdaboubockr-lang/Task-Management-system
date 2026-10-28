import { useState } from 'react'
import { COLUMNS, columnFor, formatDate, isCompleted } from '../lib/tasks.js'
import Icon from './Icon.jsx'

function TaskCard({ task, onComplete, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const done = isCompleted(task)
  const column = columnFor(task)
  const badgeStyles = {
    overdue: 'bg-rose-400/10 text-rose-300',
    completed: 'bg-emerald-400/10 text-emerald-300',
    'in-progress': 'bg-blue-400/10 text-blue-300',
    pending: 'bg-amber-400/10 text-amber-300',
  }
  const badgeLabels = { overdue: 'Overdue', completed: 'Done', 'in-progress': 'Active', pending: 'Pending' }

  return (
    <article className={`group relative rounded-xl border bg-slate-950/60 p-3.5 transition hover:border-slate-700 ${
      done ? 'border-slate-800/70 opacity-75' : 'border-slate-800'
    }`}>
      <div className="flex items-start gap-3">
        <button
          className={`mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-md border transition ${
            done ? 'border-emerald-400 bg-emerald-500 text-white' : 'border-slate-600 text-transparent hover:border-indigo-400'
          }`}
          aria-label={done ? 'Reopen task' : 'Complete task'}
          onClick={() => onComplete(task)}
        >
          {done && <Icon name="check" size={12} />}
        </button>
        <div className="min-w-0 flex-1">
          <button
            className={`block max-w-full text-left text-sm font-semibold leading-5 transition hover:text-indigo-300 ${
              done ? 'text-slate-400 line-through decoration-slate-600' : 'text-slate-100'
            }`}
            onClick={() => onEdit(task)}
            title={task.task_summary}
          >{task.task_summary}</button>
          {task.task_detail && <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">{task.task_detail}</p>}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
              <Icon name="calendar" size={13} />{formatDate(task.task_deadline)}
            </span>
            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${badgeStyles[column]}`}>{badgeLabels[column]}</span>
          </div>
        </div>
        <div className="relative">
          <button
            className="grid h-7 w-7 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-800 hover:text-white"
            aria-label={`Options for ${task.task_summary}`}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          ><Icon name="more" size={16} /></button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-10 w-36 rounded-xl border border-slate-700 bg-slate-900 p-1.5 shadow-xl shadow-black/40">
              <button className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-200 hover:bg-slate-800" onClick={() => { setMenuOpen(false); onEdit(task) }}>Edit task</button>
              <button className="w-full rounded-lg px-3 py-2 text-left text-xs text-rose-300 hover:bg-rose-400/10" onClick={() => { setMenuOpen(false); onDelete(task) }}>Delete task</button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default function TaskBoard({
  tasks,
  activeNav,
  loading,
  error,
  search,
  activeFilter,
  statusFilter,
  setSearch,
  setStatusFilter,
  setModalTask,
  setError,
  onRetry,
  onComplete,
  onDelete,
  displayName,
  onLogout,
}) {
  const heading = activeNav === 'Calendar' ? 'Calendar' : activeNav === 'Settings' ? 'Settings' : 'Tasks'
  const description = activeNav === 'Settings'
    ? 'Manage your workspace and account.'
    : 'Manage your tasks, stay organized and get things done.'

  return (
    <section className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white">{heading}</h2>
            <span className="rounded-full border border-slate-800 bg-slate-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">Workspace</span>
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex h-10 min-w-0 items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-3 text-slate-500 sm:w-52">
            <Icon name="search" size={15} />
            <input className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-slate-600" placeholder="Search tasks..." value={search} onChange={(event) => setSearch(event.target.value)} />
            {search && <button aria-label="Clear search" onClick={() => setSearch('')} className="text-slate-500 hover:text-white"><Icon name="close" size={14} /></button>}
          </label>
          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-slate-300 outline-none focus:border-indigo-400/60"
          >
            <option>All Status</option><option>Pending</option><option>In Progress</option><option>Completed</option><option>Overdue</option>
          </select>
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 text-xs font-semibold text-white transition hover:bg-indigo-400" onClick={() => setModalTask('new')}>
            <Icon name="plus" size={16} />New task
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-xs text-rose-200" role="alert">
          <span className="flex-1">{error}</span>
          <button className="font-semibold hover:text-white" onClick={onRetry}>Retry</button>
          <button aria-label="Dismiss error" onClick={() => setError('')} className="text-rose-200/70 hover:text-white"><Icon name="close" size={15} /></button>
        </div>
      )}

      {activeNav === 'Settings' ? (
        <div className="flex flex-col items-start gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-5 sm:flex-row sm:items-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 text-lg font-bold text-white">{displayName.slice(0, 1).toUpperCase()}</span>
          <div className="flex-1"><h3 className="font-semibold text-white">{displayName}</h3><p className="mt-1 text-xs text-slate-500">Signed in to your TaskFlow workspace</p></div>
          <button className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800" onClick={onLogout}>Sign out</button>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
          {COLUMNS.map((column) => {
            const columnTasks = tasks.filter((task) => columnFor(task) === column.key)
            const dotColor = {
              amber: 'bg-amber-400',
              blue: 'bg-blue-400',
              emerald: 'bg-emerald-400',
              rose: 'bg-rose-400',
            }[column.color]
            return (
              <section key={column.key} className="min-w-0 rounded-xl border border-slate-800/80 bg-slate-950/30 p-3">
                <div className="mb-3 flex items-center gap-2 px-1">
                  <span className={`h-2 w-2 rounded-full ${dotColor}`} />
                  <h3 className="flex-1 text-xs font-semibold text-slate-300">{column.label}</h3>
                  <span className="grid h-6 min-w-6 place-items-center rounded-lg bg-slate-800/80 px-1.5 text-[10px] font-semibold text-slate-400">{columnTasks.length}</span>
                </div>
                <div className="grid content-start gap-2.5">
                  {loading && tasks.length === 0 ? <p className="px-2 py-8 text-center text-xs text-slate-500">Loading tasks…</p>
                    : columnTasks.length ? columnTasks.map((task) => (
                      <TaskCard key={task.id} task={task} onComplete={onComplete} onEdit={setModalTask} onDelete={onDelete} />
                    )) : (
                      <p className="rounded-lg border border-dashed border-slate-800 px-2 py-7 text-center text-xs text-slate-600">
                        {search || activeFilter !== 'all' || statusFilter !== 'All Status' ? 'No matching tasks' : 'No tasks here yet'}
                      </p>
                    )}
                </div>
                <button className="mt-3 flex w-full items-center gap-1.5 rounded-lg px-2 py-2 text-left text-xs font-medium text-slate-500 transition hover:bg-slate-900 hover:text-indigo-300" onClick={() => setModalTask('new')}>
                  <Icon name="plus" size={14} />Add task
                </button>
              </section>
            )
          })}
        </div>
      )}
    </section>
  )
}
