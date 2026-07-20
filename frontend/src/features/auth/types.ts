// Mirrors the backend AuthResponse contract (Identity service, issue #2).
export interface AuthSession {
  accessToken: string
  /** ISO timestamp when the access token expires. */
  accessTokenExpiresAt: string
  refreshToken: string
  userId: string
  tenantId: string
  email: string
  role: string
}

export interface RegisterInput {
  tenantName: string
  email: string
  password: string
  fullName: string
}
