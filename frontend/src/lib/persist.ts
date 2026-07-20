// Small, defensive wrapper around localStorage. Storage may be unavailable
// (server-side, tests, disabled cookies) or throw (quota), so every path
// degrades to a safe no-op / fallback rather than crashing the app.

function getStorage(): Storage | null {
  try {
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      return globalThis.localStorage
    }
  } catch {
    // Accessing localStorage can throw in some privacy modes.
  }
  return null
}

export function loadJson<T>(key: string, fallback: T): T {
  const storage = getStorage()
  if (!storage) return fallback
  try {
    const raw = storage.getItem(key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

export function saveJson(key: string, value: unknown): void {
  const storage = getStorage()
  if (!storage) return
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {
    // Quota / serialization errors are non-fatal for persistence.
  }
}
