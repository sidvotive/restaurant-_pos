import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'

type Mode = 'login' | 'register'

export default function LoginPage() {
  const { isAuthenticated, login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('login')
  const [tenantName, setTenantName] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      if (mode === 'register') {
        await register({ tenantName, email, password, fullName })
      } else {
        await login(email, password)
      }
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-amber-500'

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
      <div className="w-full max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
          Restaurant POS
        </p>
        <h1 className="mt-1 text-2xl font-bold">
          {mode === 'register' ? 'Create your account' : 'Sign in'}
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'register' && (
            <>
              <label className="block">
                <span className="text-sm text-slate-400">Restaurant name</span>
                <input
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  aria-label="Restaurant name"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-400">Your name</span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  aria-label="Your name"
                  className={inputClass}
                />
              </label>
            </>
          )}
          <label className="block">
            <span className="text-sm text-slate-400">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-400">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              className={inputClass}
            />
          </label>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-50 hover:bg-amber-400"
          >
            {submitting
              ? mode === 'register'
                ? 'Creating…'
                : 'Signing in…'
              : mode === 'register'
                ? 'Create account'
                : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {mode === 'register' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'register' ? 'login' : 'register')
              setError(null)
            }}
            className="font-medium text-amber-300 hover:text-amber-200"
          >
            {mode === 'register' ? 'Sign in' : 'Create one'}
          </button>
        </p>
      </div>
    </div>
  )
}
