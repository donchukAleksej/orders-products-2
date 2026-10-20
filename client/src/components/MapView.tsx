'use client'

import { useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/store/hooks'
import { money, orderTotals } from '@/lib/format'

// Стандартні іконки Leaflet ламаються після бандлінгу — підставляємо вручну
const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
})

export default function MapView() {
  const { t } = useTranslation()
  const orders = useAppSelector(s => s.orders.items)
  const products = useAppSelector(s => s.products.items)
  const rows = useMemo(() => orderTotals(orders, products).filter(r => r.order.location), [orders, products])

  return (
    <MapContainer center={[48.9, 31.2]} zoom={6} className="map__container" scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {rows.map(({ order, products: own, totals }) => (
        <Marker key={order.id} position={[order.location!.lat, order.location!.lng]} icon={markerIcon}>
          <Popup>
            <strong>{order.title}</strong>
            <br />
            {order.location!.city}
            <br />
            {own.length} {t('map.products')}
            <br />
            {t('map.total')}: {money(totals.UAH)} UAH
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
