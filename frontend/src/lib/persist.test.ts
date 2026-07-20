import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { loadJson, saveJson } from './persist'

// Minimal in-memory localStorage stand-in (Vitest's default env is node).
class FakeStorage {
  private map = new Map<string, string>()
  getItem(key: string): string | null {
    return this.map.has(key) ? this.map.get(key)! : null
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value)
  }
  removeItem(key: string): void {
    this.map.delete(key)
  }
  clear(): void {
    this.map.clear()
  }
  key(): string | null {
    return null
  }
  get length(): number {
    return this.map.size
  }
}

const KEY = 'test.key'

describe('persist', () => {
  beforeEach(() => {
    ;(globalThis as { localStorage?: Storage }).localStorage = new FakeStorage() as unknown as Storage
  })
  afterEach(() => {
    delete (globalThis as { localStorage?: Storage }).localStorage
  })

  it('round-trips a value through save/load', () => {
    saveJson(KEY, { a: 1, b: ['x'] })
    expect(loadJson(KEY, null)).toEqual({ a: 1, b: ['x'] })
  })

  it('returns the fallback when nothing is stored', () => {
    expect(loadJson(KEY, 'default')).toBe('default')
  })

  it('returns the fallback on corrupt JSON', () => {
    globalThis.localStorage.setItem(KEY, '{not valid json')
    expect(loadJson(KEY, 42)).toBe(42)
  })

  it('is a safe no-op when storage is unavailable', () => {
    delete (globalThis as { localStorage?: Storage }).localStorage
    expect(() => saveJson(KEY, { a: 1 })).not.toThrow()
    expect(loadJson(KEY, 'fallback')).toBe('fallback')
  })
})
