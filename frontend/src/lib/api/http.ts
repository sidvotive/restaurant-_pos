// Thin fetch wrapper for talking to the backend API.
// In dev, requests go to `/api/*` and Vite proxies them to the .NET service
// (see vite.config.ts). Set VITE_API_BASE to call the API directly instead.

const API_BASE = import.meta.env.VITE_API_BASE ?? ''

let accessToken: string | null = null

/** Sets the bearer token attached to authenticated requests (from AuthContext). */
export function setAuthToken(token: string | null): void {
  accessToken = token
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface ApiFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  /** Attach the bearer token (default true). */
  auth?: boolean
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!res.ok) {
    // The API returns ProblemDetails ({ title, detail, status }) on errors.
    let message = `Request failed (${res.status})`
    try {
      const problem = await res.json()
      message = problem?.detail || problem?.title || message
    } catch {
      // Non-JSON error body; keep the default message.
    }
    throw new ApiError(message, res.status)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}
