import type { AuthSession } from './types'

/** A session is usable while its access token has not expired. */
export function isSessionValid(session: AuthSession | null, nowMs: number): boolean {
  if (!session) return false
  const expiresMs = Date.parse(session.accessTokenExpiresAt)
  return Number.isFinite(expiresMs) && expiresMs > nowMs
}
