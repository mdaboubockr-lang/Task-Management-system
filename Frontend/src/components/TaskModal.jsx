import { toDateTimeLocal } from '../lib/tasks.js'
import Icon from './Icon.jsx'

export default function TaskModal({ task, defaultDeadline, onClose, onSubmit }) {
  const isNew = task === 'new'

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-sm"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <form onSubmit={onSubmit} className="my-auto w-full max-w-lg rounded-2xl border border-slate-700/80 bg-[#101a2b] p-5 shadow-2xl shadow-black/50 sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] text-indigo-300">{isNew ? 'TASK MANAGEMENT' : 'TASK DETAILS'}</p>
            <h2 className="mt-1 text-xl font-bold text-white">{isNew ? 'Create a task' : 'Edit task'}</h2>
          </div>
          <button type="button" className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white" aria-label="Close dialog" onClick={onClose}><Icon name="close" size={17} /></button>
        </div>

        <label htmlFor="task-title" className="mb-2 block text-xs font-medium text-slate-300">Task name</label>
        <input
          id="task-title"
          name="task_summary"
          maxLength="255"
          defaultValue={isNew ? '' : task.task_summary}
          placeholder="What needs to get done?"
          required
          autoFocus
          className="mb-5 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
        />
        <label htmlFor="task-description" className="mb-2 block text-xs font-medium text-slate-300">Description</label>
        <textarea
          id="task-description"
          name="task_detail"
          rows="3"
          defaultValue={isNew ? '' : task.task_detail}
          placeholder="Add a few details..."
          required
          className="mb-5 w-full resize-y rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-3 text-sm leading-5 text-white outline-none placeholder:text-slate-600 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
        />
        <div className="mb-7 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="task-deadline" className="mb-2 block text-xs font-medium text-slate-300">Due date</label>
            <input
              id="task-deadline"
              name="task_deadline"
              type="datetime-local"
              defaultValue={isNew ? defaultDeadline : toDateTimeLocal(task.task_deadline)}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-xs text-slate-200 outline-none focus:border-indigo-400"
            />
          </div>
          <div>
            <label htmlFor="task-status" className="mb-2 block text-xs font-medium text-slate-300">Status</label>
            <select
              id="task-status"
              name="task_status"
              defaultValue={isNew ? 'Pending' : task.task_status}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-slate-200 outline-none focus:border-indigo-400"
            >
              <option value="Pending">Pending</option><option value="incomplete">In Progress</option><option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800" onClick={onClose}>Cancel</button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-400" type="submit">
            <Icon name="check" size={15} />{isNew ? 'Create task' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
