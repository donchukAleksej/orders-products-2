'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { KEYS, storage } from '@/lib/storage'
import { useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/authSlice'

const LINKS = [
  { href: '/orders', key: 'nav.orders' },
  { href: '/products', key: 'nav.products' },
  { href: '/charts', key: 'nav.charts' },
  { href: '/map', key: 'nav.map' }
]

export default function NavigationMenu() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    storage.remove(KEYS.token)
    storage.remove(KEYS.user)
    dispatch(logout())
    router.replace('/login')
  }

  return (
    <aside className="nav-menu">
      <div className="nav-menu__avatar">
        <img
          className="nav-menu__photo"
          alt="user"
          src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%23c9d5de'/%3E%3Ccircle cx='48' cy='38' r='17' fill='%23fff'/%3E%3Cpath d='M14 96c3-24 18-34 34-34s31 10 34 34z' fill='%23fff'/%3E%3C/svg%3E"
        />
        <span className="nav-menu__settings" aria-hidden="true">⚙</span>
      </div>

      <nav className="nav-menu__list">
        {LINKS.map(({ href, key }) => (
          <Link
            key={href}
            href={href}
            className={`nav-menu__link${pathname === href ? ' nav-menu__link--active' : ''}`}
          >
            {t(key)}
          </Link>
        ))}
        <button type="button" className="nav-menu__logout" onClick={handleLogout}>
          {t('nav.logout')}
        </button>
      </nav>
    </aside>
  )
}
