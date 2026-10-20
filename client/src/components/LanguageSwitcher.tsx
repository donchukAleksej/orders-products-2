'use client'

import { useTranslation } from 'react-i18next'
import { KEYS, storage } from '@/lib/storage'
import type { Lang } from '@/types'

const LANGS: { code: Lang; label: string }[] = [
  { code: 'ru', label: 'RU' },
  { code: 'uk', label: 'UA' },
  { code: 'en', label: 'EN' }
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const change = (code: Lang) => {
    i18n.changeLanguage(code)
    storage.set(KEYS.lang, code) // Web Storage
  }

  return (
    <div className="lang-switcher" role="group" aria-label="Language">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          className={`lang-switcher__btn${i18n.language === code ? ' lang-switcher__btn--active' : ''}`}
          onClick={() => change(code)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
