import Icon from './Icon.jsx'

export default function LoginPage({
  loginName,
  loginPassword,
  loginError,
  savingLogin,
  setLoginName,
  setLoginPassword,
  onSubmit,
}) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#070d19] px-5 py-12">
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <form onSubmit={onSubmit} className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
        <div className="mb-8 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-950/60">
          <Icon name="tasks" size={23} />
        </div>
        <p className="mb-2 text-xs font-bold tracking-[0.2em] text-indigo-300">WELCOME TO TASKFLOW</p>
        <h1 className="text-3xl font-bold tracking-tight text-white">Make today count.</h1>
        <p className="mb-8 mt-3 text-sm leading-6 text-slate-400">Sign in to see your tasks and keep your day moving.</p>
        <label htmlFor="login-username" className="mb-2 block text-sm font-medium text-slate-200">Username</label>
        <input
          id="login-username"
          autoComplete="username"
          value={loginName}
          onChange={(event) => setLoginName(event.target.value)}
          required
          className="mb-5 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
        />
        <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-slate-200">Password</label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={loginPassword}
          onChange={(event) => setLoginPassword(event.target.value)}
          required
          className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
        />
        {loginError && <p className="mt-4 rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm text-rose-200" role="alert">{loginError}</p>}
        <button
          className="mt-7 flex w-full items-center justify-between rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-400 disabled:cursor-wait disabled:opacity-60"
          disabled={savingLogin}
        >
          {savingLogin ? 'Signing in…' : 'Sign in'} <span aria-hidden="true">→</span>
        </button>
      </form>
    </main>
  )
}
