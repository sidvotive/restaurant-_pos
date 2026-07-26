import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { loadJson, saveJson } from '../../lib/persist'
import { authApi } from '../../lib/api/authClient'
import { setAuthToken } from '../../lib/api/http'
import { isSessionValid } from './session'
import type { AuthSession, RegisterInput } from './types'

const STORAGE_KEY = 'rpos.auth'

interface AuthContextValue {
  session: AuthSession | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function persist(session: AuthSession | null) {
  saveJson(STORAGE_KEY, session)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => {
    const stored = loadJson<AuthSession | null>(STORAGE_KEY, null)
    // Drop an expired session on load.
    const valid = isSessionValid(stored, Date.now()) ? stored : null
    // Set the bearer token synchronously so requests fired by child providers
    // on first render already carry it.
    setAuthToken(valid?.accessToken ?? null)
    return valid
  })

  const apply = useCallback((next: AuthSession) => {
    setSession(next)
    persist(next)
    setAuthToken(next.accessToken)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      apply(await authApi.login(email, password))
    },
    [apply],
  )

  const register = useCallback(
    async (input: RegisterInput) => {
      apply(await authApi.register(input))
    },
    [apply],
  )

  const logout = useCallback(() => {
    setSession(null)
    persist(null)
    setAuthToken(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: isSessionValid(session, Date.now()),
      login,
      register,
      logout,
    }),
    [session, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
