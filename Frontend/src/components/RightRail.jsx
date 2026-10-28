import Icon from './Icon.jsx'
import { formatDate } from '../lib/tasks.js'

function CalendarCard({ tasks, month, setMonth, onSelectDay }) {
  const monthDays = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay()
  const today = new Date()
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: monthDays }, (_, index) => index + 1)]
  const title = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(month)

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">Schedule</p><h2 className="mt-1 text-sm font-semibold text-white">{title}</h2></div>
        <div className="flex gap-1">
          <button className="grid h-7 w-7 place-items-center rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white" aria-label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><Icon name="left" size={14} /></button>
          <button className="grid h-7 w-7 place-items-center rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white" aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><Icon name="right" size={14} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => <span className="pb-2 text-[10px] font-medium text-slate-600" key={`${day}-${index}`}>{day}</span>)}
        {cells.map((day, index) => {
          const hasTask = day && tasks.some((task) => {
            const date = new Date(task.task_deadline)
            return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth() && date.getDate() === day
          })
          const isToday = day === today.getDate() && month.getMonth() === today.getMonth() && month.getFullYear() === today.getFullYear()
          return day ? (
            <button
              type="button"
              className={`relative mx-auto grid h-8 w-8 place-items-center rounded-lg text-[11px] transition hover:bg-slate-800 ${
                isToday ? 'bg-indigo-500 font-bold text-white' : hasTask ? 'font-semibold text-indigo-200' : 'text-slate-400'
              }`}
              key={`${month.toISOString()}-${day}`}
              title={hasTask ? 'Tasks due on this day' : undefined}
              onClick={onSelectDay}
            >
              {day}{hasTask && !isToday && <i className="absolute bottom-1 h-1 w-1 rounded-full bg-indigo-400" />}
            </button>
          ) : <span key={`empty-${index}`} />
        })}
      </div>
    </section>
  )
}

function ActivityCard({ activity }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">Updates</p><h2 className="mt-1 text-sm font-semibold text-white">Recent activity</h2></div>
        <Icon name="clock" size={16} className="text-slate-600" />
      </div>
      {activity.length ? (
        <div className="grid gap-4">
          {activity.map((item, index) => (
            <div className="flex gap-3" key={item.id}>
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${
                index % 4 === 0 ? 'bg-emerald-400/10 text-emerald-300'
                  : index % 4 === 1 ? 'bg-indigo-400/10 text-indigo-300'
                    : index % 4 === 2 ? 'bg-sky-400/10 text-sky-300' : 'bg-rose-400/10 text-rose-300'
              }`}><Icon name={index % 4 === 0 ? 'check' : index % 4 === 1 ? 'plus' : index % 4 === 2 ? 'tasks' : 'close'} size={15} /></span>
              <div className="min-w-0 pt-0.5">
                <p className="text-xs font-medium text-slate-200">{item.message}</p>
                <p className="mt-1 truncate text-[11px] text-slate-500">{item.taskName}</p>
                <p className="mt-1 text-[10px] text-slate-600">{formatDate(item.time, { hour: 'numeric', minute: '2-digit' })} · just now</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-800 px-3 py-7 text-center">
          <span className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-xl bg-slate-800/70 text-slate-500"><Icon name="clock" size={17} /></span>
          <p className="text-xs leading-5 text-slate-500">Your task updates will<br />show up here.</p>
        </div>
      )}
    </section>
  )
}

export default function RightRail({ tasks, month, setMonth, activity, onSelectDay }) {
  return (
    <aside className="grid content-start gap-4">
      <CalendarCard tasks={tasks} month={month} setMonth={setMonth} onSelectDay={onSelectDay} />
      <ActivityCard activity={activity} />
      <section className="overflow-hidden rounded-2xl border border-indigo-400/10 bg-gradient-to-br from-indigo-500/15 via-slate-900 to-slate-900 p-5">
        <span className="text-2xl text-indigo-300">✦</span>
        <h2 className="mt-3 text-base font-semibold text-white">Progress, not perfection.</h2>
        <p className="mt-2 text-xs leading-5 text-slate-400">Keep going, you’re doing great!</p>
        <div className="mt-5 h-px bg-gradient-to-r from-indigo-400/40 to-transparent" />
        <div className="mt-3 flex items-center gap-1 text-indigo-300/70" aria-hidden="true">
          <span className="h-5 w-5 rotate-45 rounded-sm bg-indigo-800/80" />
          <span className="h-8 w-8 rotate-45 rounded-sm bg-indigo-500/70" />
          <span className="h-4 w-4 rotate-45 rounded-sm bg-indigo-700/70" />
        </div>
      </section>
    </aside>
  )
}
