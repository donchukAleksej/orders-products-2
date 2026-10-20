'use client'

import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'

// Lazy loading: recharts підвантажується лише на сторінці графіків, без SSR
const ChartsView = dynamic(() => import('./ChartsView'), {
  ssr: false,
  loading: () => <div className="text-muted">…</div>
})

export default function ChartsPage() {
  const { t } = useTranslation()
  return (
    <div>
      <div className="page-title">
        <h1 className="page-title__text">{t('charts.title')}</h1>
      </div>
      <ChartsView />
    </div>
  )
}
