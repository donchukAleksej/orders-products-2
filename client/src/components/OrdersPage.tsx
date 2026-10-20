'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectOrder } from '@/store/ordersSlice'
import { addOrder, addProduct, deleteOrder, deleteProduct } from '@/store/thunks'
import { groupByOrder, sumPrices } from '@/lib/format'
import { compose, minLength, positiveNumber, required } from '@/lib/validators'
import type { Order, Product } from '@/types'
import type { FieldConfig } from './FormModal'
import OrderItem from './OrderItem'
import OrderDetails from './OrderDetails'
import ConfirmModal from './ConfirmModal'

// Lazy loading: форма підвантажується тільки коли її відкрили
const FormModal = dynamic(() => import('./FormModal'))

const ORDER_FIELDS: FieldConfig[] = [
  { name: 'title', labelKey: 'fields.orderTitle', validate: compose(required, minLength(3)) },
  { name: 'description', labelKey: 'fields.description' }
]

const PRODUCT_FIELDS: FieldConfig[] = [
  { name: 'title', labelKey: 'fields.productTitle', validate: compose(required, minLength(3)) },
  { name: 'type', labelKey: 'fields.productType', validate: required },
  { name: 'serialNumber', labelKey: 'fields.serialNumber', type: 'number', validate: positiveNumber },
  { name: 'priceUSD', labelKey: 'fields.priceUSD', type: 'number', validate: positiveNumber },
  { name: 'priceUAH', labelKey: 'fields.priceUAH', type: 'number', validate: positiveNumber }
]

type DeleteTarget = { kind: 'order'; item: Order } | { kind: 'product'; item: Product }

export default function OrdersPage() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { items: orders, selectedId, status } = useAppSelector(s => s.orders)
  const products = useAppSelector(s => s.products.items)
  const search = useAppSelector(s => s.ui.search).trim().toLowerCase()

  const [toDelete, setToDelete] = useState<DeleteTarget | null>(null)
  const [form, setForm] = useState<'order' | 'product' | null>(null)

  const byOrder = useMemo(() => groupByOrder(products), [products])
  const visible = orders.filter(o => o.title.toLowerCase().includes(search))
  const selected = orders.find(o => o.id === selectedId)
  const isOpen = Boolean(selected)

  const confirm = async () => {
    if (!toDelete) return
    if (toDelete.kind === 'order') await dispatch(deleteOrder(toDelete.item.id))
    else await dispatch(deleteProduct(toDelete.item.id))
    setToDelete(null)
  }

  const submitForm = async (values: Record<string, string>) => {
    if (form === 'order') await dispatch(addOrder(values as { title: string; description?: string }))
    else if (selected) await dispatch(addProduct({ orderId: selected.id, data: values }))
    setForm(null)
  }

  return (
    <div className={`orders${isOpen ? ' orders--open' : ''}`}>
      <div className="page-title">
        <button className="page-title__add" onClick={() => setForm('order')} aria-label={t('orders.addOrder')}>+</button>
        <h1 className="page-title__text">{t('orders.title')} / {orders.length}</h1>
      </div>

      {status === 'loading' && <div className="text-muted">{t('common.loading')}</div>}
      {status === 'error' && <div className="text-danger">{t('common.loadError')}</div>}

      <div className="orders__layout">
        <div className="orders__list">
          {visible.map(order => {
            const own = byOrder[order.id] || []
            return (
              <OrderItem
                key={order.id}
                order={order}
                products={own}
                totals={sumPrices(own)}
                compact={isOpen}
                active={order.id === selectedId}
                onSelect={id => dispatch(selectOrder(id))}
                onDelete={o => setToDelete({ kind: 'order', item: o })}
              />
            )
          })}
        </div>

        {selected && (
          <OrderDetails
            key={selected.id}
            order={selected}
            products={byOrder[selected.id] || []}
            onClose={() => dispatch(selectOrder(null))}
            onAddProduct={() => setForm('product')}
            onDeleteProduct={p => setToDelete({ kind: 'product', item: p })}
          />
        )}
      </div>

      {toDelete && (
        <ConfirmModal
          title={toDelete.kind === 'order' ? t('orders.deleteOrderQ') : t('orders.deleteProductQ')}
          products={toDelete.kind === 'order' ? byOrder[toDelete.item.id] || [] : [toDelete.item]}
          onCancel={() => setToDelete(null)}
          onConfirm={confirm}
        />
      )}

      {form && (
        <FormModal
          title={form === 'order' ? t('orders.newOrder') : t('orders.newProduct')}
          fields={form === 'order' ? ORDER_FIELDS : PRODUCT_FIELDS}
          onSubmit={submitForm}
          onClose={() => setForm(null)}
        />
      )}
    </div>
  )
}
