import { describe, expect, it } from 'vitest'
import { isSessionValid } from './session'
import type { AuthSession } from './types'

const session = (expiresAt: string): AuthSession => ({
  accessToken: 't',
  accessTokenExpiresAt: expiresAt,
  refreshToken: 'r',
  userId: 'u',
  tenantId: 'tn',
  email: 'a@b.c',
  role: 'Owner',
})

const NOW = Date.parse('2026-01-01T00:00:00.000Z')

describe('isSessionValid', () => {
  it('is false for a null session', () => {
    expect(isSessionValid(null, NOW)).toBe(false)
  })

  it('is true when the token expires in the future', () => {
    expect(isSessionValid(session('2026-01-01T00:15:00.000Z'), NOW)).toBe(true)
  })

  it('is false when the token has expired', () => {
    expect(isSessionValid(session('2025-12-31T23:59:59.000Z'), NOW)).toBe(false)
  })

  it('is false for an unparseable expiry', () => {
    expect(isSessionValid(session('not-a-date'), NOW)).toBe(false)
  })
})
