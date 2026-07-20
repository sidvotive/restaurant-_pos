import type { AuthSession, RegisterInput } from '../../features/auth/types'

// The auth API the app depends on — shape matches the backend Identity
// endpoints (POST /api/auth/register|login|refresh, issue #2). A mock backs
// it until the backend is reachable; swap in an HTTP implementation later.
export interface AuthApi {
  login(email: string, password: string): Promise<AuthSession>
  register(input: RegisterInput): Promise<AuthSession>
  refresh(refreshToken: string): Promise<AuthSession>
}

export class AuthError extends Error {}

/** Demo credentials surfaced on the login screen while the backend is mocked. */
export const DEMO_EMAIL = 'owner@demo.test'
export const DEMO_PASSWORD = 'password123'

const ACCESS_TOKEN_MINUTES = 15

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

function sessionFor(email: string, role: string): AuthSession {
  const expires = new Date(Date.now() + ACCESS_TOKEN_MINUTES * 60_000)
  return {
    accessToken: `mock.${btoa(email)}.token`,
    accessTokenExpiresAt: expires.toISOString(),
    refreshToken: `mock-refresh-${Math.random().toString(36).slice(2)}`,
    userId: 'mock-user-id',
    tenantId: 'mock-tenant-id',
    email,
    role,
  }
}

export const mockAuthApi: AuthApi = {
  login: (email, password) => {
    const normalized = email.trim().toLowerCase()
    if (normalized === DEMO_EMAIL && password === DEMO_PASSWORD) {
      return delay(sessionFor(normalized, 'Owner'))
    }
    return Promise.reject(new AuthError('Invalid email or password.'))
  },
  register: (input) => {
    if (input.password.length < 8) {
      return Promise.reject(new AuthError('Password must be at least 8 characters.'))
    }
    return delay(sessionFor(input.email.trim().toLowerCase(), 'Owner'))
  },
  refresh: (refreshToken) => {
    if (!refreshToken) return Promise.reject(new AuthError('Missing refresh token.'))
    return delay(sessionFor(DEMO_EMAIL, 'Owner'))
  },
}

// Single access point. Replace with the real HTTP client once the backend exists.
export const authApi: AuthApi = mockAuthApi
