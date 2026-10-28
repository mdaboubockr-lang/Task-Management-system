import Icon from './Icon.jsx'

const cards = [
  { label: 'Total tasks', key: 'total', icon: 'tasks', color: 'from-indigo-500 to-blue-600', note: 'Everything on your list' },
  { label: 'Pending', key: 'pending', icon: 'clock', color: 'from-amber-400 to-orange-500', note: 'Ready when you are' },
  { label: 'In progress', key: 'progress', icon: 'clock', color: 'from-sky-400 to-blue-600', note: 'Keep up the momentum' },
  { label: 'Completed', key: 'completed', icon: 'check', color: 'from-emerald-400 to-teal-600', note: 'Great work so far' },
]

export default function SummaryCards({ counts }) {
  return (
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label="Task summary">
      {cards.map(({ label, key, icon, color, note }) => (
        <article key={key} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg shadow-black/5 transition hover:-translate-y-0.5 hover:border-slate-700">
          <div className="flex items-start justify-between gap-2">
            <span className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg shadow-black/20`}>
              <Icon name={icon} size={19} />
            </span>
            <span className="mt-1 text-xs text-slate-600">TASKFLOW</span>
          </div>
          <p className="mb-1 mt-5 text-sm text-slate-400">{label}</p>
          <div className="flex items-end justify-between gap-2">
            <strong className="text-3xl font-bold tracking-tight text-white">{counts[key]}</strong>
            <span className="pb-1 text-right text-[11px] text-slate-500">{note}</span>
          </div>
        </article>
      ))}
    </section>
  )
}
