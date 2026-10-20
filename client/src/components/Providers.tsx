'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'
import { KEYS, storage } from '@/lib/storage'
import { makeStore, type AppStore } from '@/store'
import { hydrate } from '@/store/authSlice'
import { setTypeFilter } from '@/store/productsSlice'

export default function Providers({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) storeRef.current = makeStore()
  const store = storeRef.current

  // Після монтування читаємо Web Storage (мова, токен, фільтр) — так SSR і клієнт збігаються
  useEffect(() => {
    const lang = storage.get(KEYS.lang)
    if (lang && lang !== i18n.language && ['ru', 'uk', 'en'].includes(lang)) i18n.changeLanguage(lang)

    store.dispatch(setTypeFilter(storage.get(KEYS.typeFilter) ?? ''))
    store.dispatch(hydrate({ token: storage.get(KEYS.token), username: storage.get(KEYS.user) }))

    const syncHtmlLang = (l: string) => {
      document.documentElement.lang = l
    }
    syncHtmlLang(i18n.language)
    i18n.on('languageChanged', syncHtmlLang)
    return () => i18n.off('languageChanged', syncHtmlLang)
  }, [store])

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </Provider>
  )
}
