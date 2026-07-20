import { describe, expect, it } from 'vitest'
import { AuthError, DEMO_EMAIL, DEMO_PASSWORD, mockAuthApi } from './authClient'
import { isSessionValid } from '../../features/auth/session'

describe('mockAuthApi.login', () => {
  it('returns a valid session for the demo credentials', async () => {
    const session = await mockAuthApi.login(DEMO_EMAIL, DEMO_PASSWORD)
    expect(session.email).toBe(DEMO_EMAIL)
    expect(session.role).toBe('Owner')
    expect(isSessionValid(session, Date.now())).toBe(true)
  })

  it('is case-insensitive on the email', async () => {
    const session = await mockAuthApi.login('OWNER@DEMO.TEST', DEMO_PASSWORD)
    expect(session.email).toBe(DEMO_EMAIL)
  })

  it('rejects a wrong password', async () => {
    await expect(mockAuthApi.login(DEMO_EMAIL, 'wrong')).rejects.toBeInstanceOf(AuthError)
  })

  it('rejects an unknown email', async () => {
    await expect(mockAuthApi.login('nobody@demo.test', DEMO_PASSWORD)).rejects.toBeInstanceOf(
      AuthError,
    )
  })
})

describe('mockAuthApi.register', () => {
  it('rejects a short password', async () => {
    await expect(
      mockAuthApi.register({ tenantName: 'T', email: 'a@b.c', password: 'short', fullName: 'A' }),
    ).rejects.toBeInstanceOf(AuthError)
  })

  it('returns a session for a valid registration', async () => {
    const session = await mockAuthApi.register({
      tenantName: 'Tasty Co',
      email: 'new@demo.test',
      password: 'password123',
      fullName: 'New Owner',
    })
    expect(session.email).toBe('new@demo.test')
    expect(isSessionValid(session, Date.now())).toBe(true)
  })
})
