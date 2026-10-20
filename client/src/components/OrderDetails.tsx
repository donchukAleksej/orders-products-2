'use client'

import { useTranslation } from 'react-i18next'
import ProductItem from './ProductItem'
import type { Order, Product } from '@/types'

interface Props {
  order: Order
  products: Product[]
  onClose: () => void
  onAddProduct: () => void
  onDeleteProduct: (product: Product) => void
}

export default function OrderDetails({ order, products, onClose, onAddProduct, onDeleteProduct }: Props) {
  const { t } = useTranslation()

  return (
    <section className="order-details">
      <button className="order-details__close" onClick={onClose} aria-label={t('common.close')}>×</button>

      <div className="order-details__head">
        <h2 className="order-details__title">{order.title}</h2>
        <button className="order-details__add" onClick={onAddProduct}>
          <span className="order-details__add-icon">+</span> {t('orders.addProduct')}
        </button>
      </div>

      <div className="order-details__list">
        {products.length === 0 && <div className="order-details__empty">{t('orders.empty')}</div>}
        {products.map(p => (
          <ProductItem key={p.id} product={p} onDelete={onDeleteProduct} />
        ))}
      </div>
    </section>
  )
}
