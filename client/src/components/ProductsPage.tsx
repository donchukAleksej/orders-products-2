'use client'

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setTypeFilter } from '@/store/productsSlice'
import { deleteProduct } from '@/store/thunks'
import { KEYS, storage } from '@/lib/storage'
import type { Product } from '@/types'
import ProductItem from './ProductItem'
import ConfirmModal from './ConfirmModal'

export default function ProductsPage() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { items, typeFilter, status } = useAppSelector(s => s.products)
  const orders = useAppSelector(s => s.orders.items)
  const search = useAppSelector(s => s.ui.search).trim().toLowerCase()
  const [toDelete, setToDelete] = useState<Product | null>(null)

  const types = useMemo(() => [...new Set(items.map(p => p.type))].sort(), [items])
  const orderTitles = useMemo(() => Object.fromEntries(orders.map(o => [o.id, o.title])), [orders])

  const visible = items.filter(
    p => (!typeFilter || p.type === typeFilter) && p.title.toLowerCase().includes(search)
  )

  const changeType = (value: string) => {
    dispatch(setTypeFilter(value))
    storage.set(KEYS.typeFilter, value) // фільтр переживає перезавантаження
  }

  return (
    <div className="products">
      <div className="page-title page-title--filters">
        <h1 className="page-title__text">{t('products.title')} / {visible.length}</h1>

        <label className="products__filter">
          <span>{t('products.type')}:</span>
          <select className="form-select form-select-sm" value={typeFilter} onChange={e => changeType(e.target.value)}>
            <option value="">{t('products.all')}</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
      </div>

      {status === 'error' && <div className="text-danger">{t('common.loadError')}</div>}

      <div className="products__scroll">
        <div className="products__list">
          {visible.map(p => (
            <ProductItem key={p.id} product={p} variant="full" orderTitle={orderTitles[p.order]} onDelete={setToDelete} />
          ))}
          {status === 'ready' && visible.length === 0 && <div className="text-muted">{t('common.nothing')}</div>}
        </div>
      </div>

      {toDelete && (
        <ConfirmModal
          title={t('orders.deleteProductQ')}
          products={[toDelete]}
          onCancel={() => setToDelete(null)}
          onConfirm={async () => {
            await dispatch(deleteProduct(toDelete.id))
            setToDelete(null)
          }}
        />
      )}
    </div>
  )
}
