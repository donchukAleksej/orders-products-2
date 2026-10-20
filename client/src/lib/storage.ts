// Безпечна обгортка над Web Storage (працює і на сервері під час SSR)
export const KEYS = {
  token: 'ip.token',
  user: 'ip.user',
  lang: 'ip.lang',
  typeFilter: 'ip.typeFilter'
} as const

const available = () => typeof window !== 'undefined' && !!window.localStorage

export const storage = {
  get(key: string): string | null {
    try {
      return available() ? window.localStorage.getItem(key) : null
    } catch {
      return null
    }
  },
  set(key: string, value: string): void {
    try {
      if (available()) window.localStorage.setItem(key, value)
    } catch {
      /* квота або приватний режим — ігноруємо */
    }
  },
  remove(key: string): void {
    try {
      if (available()) window.localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
  }
}
