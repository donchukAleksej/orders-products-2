'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setSearch } from '@/store/uiSlice'
import { clock, topDate, weekday } from '@/lib/format'
import type { Lang } from '@/types'
import useActiveSessions from './useActiveSessions'
import LanguageSwitcher from './LanguageSwitcher'

export default function TopMenu() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Lang
  const dispatch = useAppDispatch()
  const search = useAppSelector(s => s.ui.search)
  const sessions = useActiveSessions()
  // null на сервері й при першому рендері → без hydration mismatch
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="top-menu">
      <div className="top-menu__brand">
        <span className="top-menu__logo" aria-hidden="true">
          <svg viewBox="0 0 24 28" width="30" height="34">
            <path d="M12 1 2 5v8c0 7 4.5 11.5 10 14 5.5-2.5 10-7 10-14V5z" fill="#82b844" />
            <circle cx="12" cy="11" r="3.2" fill="#fff" />
            <path d="M6 20c1-3.5 3.5-5 6-5s5 1.5 6 5z" fill="#fff" />
          </svg>
        </span>
        <span className="top-menu__title">INVENTORY</span>
      </div>

      <input
        className="top-menu__search"
        type="search"
        placeholder={t('top.search')}
        value={search}
        onChange={e => dispatch(setSearch(e.target.value))}
      />

      <div className="top-menu__right">
        <LanguageSwitcher />
        <div className="top-menu__date" suppressHydrationWarning>
          <div className="top-menu__weekday">{now ? weekday(now, lang) : '\u00A0'}</div>
          <div className="top-menu__day">{now ? topDate(now, lang) : '\u00A0'}</div>
        </div>
        <div className="top-menu__time" suppressHydrationWarning>
          <span className="top-menu__clock-icon" aria-hidden="true" />
          {now ? clock(now) : '--:--:--'}
        </div>
        <div className="top-menu__sessions" title={t('top.sessions')}>
          <span className="top-menu__sessions-dot" />
          {sessions}
        </div>
      </div>
    </header>
  )
}
