'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { KEYS, storage } from '@/lib/storage'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/authSlice'

// Пускає далі тільки з JWT; інакше → /login
export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { token, hydrated } = useAppSelector(s => s.auth)

  useEffect(() => {
    if (hydrated && !token) router.replace('/login')
  }, [hydrated, token, router])

  // токен прострочився (401 від API)
  useEffect(() => {
    const onExpired = () => {
      storage.remove(KEYS.token)
      storage.remove(KEYS.user)
      dispatch(logout())
    }
    window.addEventListener('auth:expired', onExpired)
    return () => window.removeEventListener('auth:expired', onExpired)
  }, [dispatch])

  if (!hydrated || !token) return null
  return <>{children}</>
}
