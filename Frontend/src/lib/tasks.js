export const TASKS_URL = '/Api/get/book_list/create'
export const TOKEN_URL = '/api/token/'
export const REFRESH_URL = '/api/token/refresh/'

export const COLUMNS = [
  { key: 'pending', label: 'Pending', color: 'amber' },
  { key: 'in-progress', label: 'In Progress', color: 'blue' },
  { key: 'completed', label: 'Completed', color: 'emerald' },
  { key: 'overdue', label: 'Overdue', color: 'rose' },
]

export function readStoredTokens() {
  try {
    const stored = JSON.parse(localStorage.getItem('taskflow-auth') || 'null')
    return stored?.access ? stored : null
  } catch {
    return null
  }
}

export async function requestJson(url, options = {}, tokens = null, onTokens = () => {}) {
  const send = (access) => fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
      ...options.headers,
    },
  })

  let response = await send(tokens?.access)
  if (response.status === 401 && tokens?.refresh && url !== REFRESH_URL) {
    const refreshResponse = await fetch(REFRESH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: tokens.refresh }),
    })
    if (refreshResponse.ok) {
      const next = { ...tokens, access: (await refreshResponse.json()).access }
      onTokens(next)
      response = await send(next.access)
    }
  }

  if (!response.ok) {
    let detail = `Request failed (${response.status})`
    try {
      const body = await response.json()
      detail = body.detail || Object.entries(body)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join(' · ') || detail
    } catch {
      // Keep the HTTP status when the server does not return JSON.
    }
    throw new Error(detail)
  }
  return response.status === 204 ? null : response.json()
}

export const getStatus = (task) => String(task.task_status).toLowerCase()
export const isCompleted = (task) => getStatus(task) === 'completed'
export const isOverdue = (task) => !isCompleted(task) && new Date(task.task_deadline).getTime() < Date.now()
export const columnFor = (task) => (
  isOverdue(task) ? 'overdue'
    : isCompleted(task) ? 'completed'
      : getStatus(task) === 'incomplete' ? 'in-progress' : 'pending'
)

export function formatDate(value, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'No due date' : new Intl.DateTimeFormat('en-US', options).format(date)
}

export function toDateTimeLocal(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}
