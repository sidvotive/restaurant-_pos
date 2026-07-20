import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import { DEMO_EMAIL, DEMO_PASSWORD } from '../lib/api/authClient'

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
      <div className="w-full max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
          Restaurant POS
        </p>
        <h1 className="mt-1 text-2xl font-bold">Sign in</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm text-slate-400">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-amber-500"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-400">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-amber-500"
            />
          </label>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-50 hover:bg-amber-400"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center text-xs text-slate-500">
          Demo mode (backend mocked): <span className="text-slate-300">{DEMO_EMAIL}</span> /{' '}
          <span className="text-slate-300">{DEMO_PASSWORD}</span>
        </p>
      </div>
    </div>
  )
}
