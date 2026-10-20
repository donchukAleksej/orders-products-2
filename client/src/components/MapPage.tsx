'use client'

import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'

// Lazy loading: Leaflet працює тільки в браузері, тому ssr: false
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => <div className="text-muted">…</div>
})

export default function MapPage() {
  const { t } = useTranslation()
  return (
    <div>
      <div className="page-title">
        <h1 className="page-title__text">{t('map.title')}</h1>
      </div>
      <MapView />
    </div>
  )
}
