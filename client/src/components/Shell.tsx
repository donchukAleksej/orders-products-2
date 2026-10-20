'use client'

import { useEffect, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useAppDispatch } from '@/store/hooks'
import { fetchOrders, fetchProducts } from '@/store/thunks'
import TopMenu from './TopMenu'
import NavigationMenu from './NavigationMenu'

export default function Shell({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const pathname = usePathname()

  useEffect(() => {
    dispatch(fetchOrders())
    dispatch(fetchProducts())
  }, [dispatch])

  return (
    <div className="app">
      <TopMenu />
      <div className="app__body">
        <NavigationMenu />
        {/* key => анімація при переході між роутами */}
        <main className="app__content page-transition" key={pathname}>
          {children}
        </main>
      </div>
    </div>
  )
}
