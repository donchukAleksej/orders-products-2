import axios from 'axios'
import { KEYS, storage } from '@/lib/storage'

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

const api = axios.create({ baseURL: `${API_URL}/api` })

// JWT з Web Storage додається до кожного запиту
api.interceptors.request.use(config => {
  const token = storage.get(KEYS.token)
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  return config
})

// Прострочений / недійсний токен → повідомляємо застосунок
api.interceptors.response.use(
  res => res,
  error => {
    const url: string = error?.config?.url ?? ''
    if (error?.response?.status === 401 && !url.includes('/auth/login') && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth:expired'))
    }
    return Promise.reject(error)
  }
)

export default api
