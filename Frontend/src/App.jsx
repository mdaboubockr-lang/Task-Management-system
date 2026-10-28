import { useCallback, useEffect, useMemo, useState } from 'react'
import Icon from './components/Icon.jsx'
import LoginPage from './components/LoginPage.jsx'
import RightRail from './components/RightRail.jsx'
import Sidebar from './components/Sidebar.jsx'
import SummaryCards from './components/SummaryCards.jsx'
import TaskBoard from './components/TaskBoard.jsx'
import TaskModal from './components/TaskModal.jsx'
import Topbar from './components/Topbar.jsx'
import { columnFor, getStatus, isCompleted, isOverdue, readStoredTokens, requestJson, TASKS_URL, TOKEN_URL } from './lib/tasks.js'

export default function App() {
  const [tokens, setTokens] = useState(readStoredTokens)
  const [username, setUsername] = useState(() => localStorage.getItem('taskflow-user') || '')
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [modalTask, setModalTask] = useState(undefined)
  const [toast, setToast] = useState('')
  const [activity, setActivity] = useState([])
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [loginName, setLoginName] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [savingLogin, setSavingLogin] = useState(false)

  const rememberTokens = useCallback((next) => {
    setTokens(next)
    localStorage.setItem('taskflow-auth', JSON.stringify(next))
  }, [])

  const addActivity = useCallback((message, taskName) => {
    setActivity((items) => [{ id: Date.now(), message, taskName, time: new Date() }, ...items].slice(0, 5))
  }, [])

  const loadTasks = useCallback(async () => {
    if (!tokens) return
    setLoading(true)
    setError('')
    try {
      const data = await requestJson(TASKS_URL, {}, tokens, rememberTokens)
      setTasks(Array.isArray(data) ? data : [])
    } catch (requestError) {
      setError(requestError.message)
      if (requestError.message.includes('401') || requestError.message.toLowerCase().includes('token')) {
        setTokens(null)
        localStorage.removeItem('taskflow-auth')
      }
    } finally {
      setLoading(false)
    }
  }, [rememberTokens, tokens])

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadTasks() }, 0)
    return () => window.clearTimeout(timer)
  }, [loadTasks])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        document.querySelector('#global-search')?.focus()
      }
      if (event.key === 'Escape') setModalTask(undefined)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const counts = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter((task) => getStatus(task) === 'pending').length,
    progress: tasks.filter((task) => getStatus(task) === 'incomplete').length,
    completed: tasks.filter(isCompleted).length,
    overdue: tasks.filter(isOverdue).length,
  }), [tasks])

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    return tasks.filter((task) => {
      const matchesSearch = !query || `${task.task_summary} ${task.task_detail}`.toLowerCase().includes(query)
      const matchesSidebar = activeFilter === 'all'
        || (activeFilter === 'pending' && getStatus(task) === 'pending')
        || (activeFilter === 'in-progress' && getStatus(task) === 'incomplete')
        || (activeFilter === 'completed' && isCompleted(task))
      const matchesStatus = statusFilter === 'All Status' || columnFor(task) === statusFilter.toLowerCase().replace(' ', '-')
      return matchesSearch && matchesSidebar && matchesStatus
    })
  }, [activeFilter, search, statusFilter, tasks])

  const handleLogin = async (event) => {
    event.preventDefault()
    setSavingLogin(true)
    setLoginError('')
    try {
      const next = await requestJson(TOKEN_URL, {
        method: 'POST',
        body: JSON.stringify({ username: loginName.trim(), password: loginPassword }),
      })
      rememberTokens(next)
      setUsername(loginName.trim())
      localStorage.setItem('taskflow-user', loginName.trim())
      setLoginPassword('')
    } catch (requestError) {
      setLoginError(requestError.message)
    } finally {
      setSavingLogin(false)
    }
  }

  const handleLogout = () => {
    setTokens(null)
    setTasks([])
    setUsername('')
    localStorage.removeItem('taskflow-auth')
    localStorage.removeItem('taskflow-user')
  }

  const handleNavigate = (label) => {
    if (label === 'Create Task') {
      setModalTask('new')
      return
    }
    setActiveNav(label)
    setActiveFilter('all')
  }

  const handleFilter = (filter) => {
    setActiveFilter(filter)
    setActiveNav('My Tasks')
  }

  const handleSelectCalendarDay = () => {
    setSearch('')
    setStatusFilter('All Status')
    setActiveFilter('all')
  }

  const saveTask = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const task = {
      task_summary: String(formData.get('task_summary')).trim(),
      task_detail: String(formData.get('task_detail')).trim(),
      task_deadline: new Date(String(formData.get('task_deadline'))).toISOString(),
      task_status: String(formData.get('task_status')),
    }
    const existing = modalTask && modalTask !== 'new' ? modalTask : null
    try {
      const saved = await requestJson(existing ? `/Api/update/all/${existing.id}/` : TASKS_URL, {
        method: existing ? 'PATCH' : 'POST',
        body: JSON.stringify(task),
      }, tokens, rememberTokens)
      setTasks((items) => existing ? items.map((item) => item.id === saved.id ? saved : item) : [saved, ...items])
      addActivity(existing ? 'Task updated' : 'New task created', task.task_summary)
      setModalTask(undefined)
      setToast(existing ? 'Task updated successfully' : 'Task created successfully')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const toggleComplete = async (task) => {
    try {
      const saved = await requestJson(`/Api/update/all/${task.id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ task_status: isCompleted(task) ? 'Pending' : 'completed' }),
      }, tokens, rememberTokens)
      setTasks((items) => items.map((item) => item.id === saved.id ? saved : item))
      addActivity(isCompleted(saved) ? 'Task marked as completed' : 'Task reopened', saved.task_summary)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const deleteTask = async (task) => {
    if (!window.confirm(`Delete "${task.task_summary}"?`)) return
    try {
      await requestJson(`/Api/update/all/${task.id}/`, { method: 'DELETE' }, tokens, rememberTokens)
      setTasks((items) => items.filter((item) => item.id !== task.id))
      addActivity('Task deleted', task.task_summary)
      setToast('Task deleted')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  if (!tokens) {
    return (
      <LoginPage
        loginName={loginName}
        loginPassword={loginPassword}
        loginError={loginError}
        savingLogin={savingLogin}
        setLoginName={setLoginName}
        setLoginPassword={setLoginPassword}
        onSubmit={handleLogin}
      />
    )
  }

  const displayName = username || 'there'
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const defaultDeadline = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000).toISOString().slice(0, 16)

  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100">
      <Sidebar
        activeNav={activeNav}
        activeFilter={activeFilter}
        counts={counts}
        displayName={displayName}
        onNavigate={handleNavigate}
        onFilter={handleFilter}
        onLogout={handleLogout}
      />
      <div className="min-h-screen lg:ml-64">
        <Topbar search={search} setSearch={setSearch} displayName={displayName} onLogout={handleLogout} />
        <main className="mx-auto max-w-[1800px] px-4 pb-8 sm:px-7 lg:px-9">
          <section className="relative mb-5 flex min-h-44 items-center overflow-hidden rounded-b-3xl border-b border-indigo-400/10 bg-gradient-to-br from-indigo-500/10 via-[#0b1425] to-[#0b1425] px-5 py-7 sm:px-8">
            <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="relative">
              <p className="mb-2 text-sm text-slate-400">Good morning,</p>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{displayName} <span className="text-3xl">👋</span></h1>
              <p className="mt-2 text-sm text-slate-400">Here’s what’s happening with your tasks today.</p>
            </div>
            <div className="absolute bottom-0 right-0 hidden items-end gap-2 pr-12 text-indigo-300/20 sm:flex" aria-hidden="true">
              <Icon name="tasks" size={88} />
            </div>
          </section>

          <div className="mb-6"><SummaryCards counts={counts} /></div>
          <div className="grid items-start gap-5 2xl:grid-cols-[minmax(0,1fr)_280px]">
            <TaskBoard
              tasks={visibleTasks}
              activeNav={activeNav}
              activeFilter={activeFilter}
              statusFilter={statusFilter}
              loading={loading}
              error={error}
              search={search}
              setSearch={setSearch}
              setStatusFilter={setStatusFilter}
              setModalTask={setModalTask}
              setError={setError}
              onRetry={loadTasks}
              onComplete={toggleComplete}
              onDelete={deleteTask}
              displayName={displayName}
              onLogout={handleLogout}
            />
            <RightRail tasks={tasks} month={month} setMonth={setMonth} activity={activity} onSelectDay={handleSelectCalendarDay} />
          </div>
        </main>
      </div>

      {modalTask !== undefined && <TaskModal task={modalTask} defaultDeadline={defaultDeadline} onClose={() => setModalTask(undefined)} onSubmit={saveTask} />}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-400/20 bg-slate-900 px-4 py-3 text-sm font-medium text-emerald-200 shadow-xl shadow-black/30" role="status">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-400/15"><Icon name="check" size={14} /></span>{toast}
        </div>
      )}
    </div>
  )
}
