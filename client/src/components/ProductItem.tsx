'use client'

import { useTranslation } from 'react-i18next'
import { TrashIcon } from './Icons'
import { longDate, money, numericDate, priceOf } from '@/lib/format'
import type { Lang, Product } from '@/types'

interface Props {
  product: Product
  orderTitle?: string
  variant?: 'compact' | 'full'
  onDelete?: (product: Product) => void
}

export default function ProductItem({ product, orderTitle, variant = 'compact', onDelete }: Props) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Lang
  const statusClass = product.status === 'repair' ? 'product-item__status--repair' : 'product-item__status--free'
  const dotClass = product.status === 'repair' ? 'product-item__dot--dark' : ''

  const photo = <img className="product-item__photo" src="/img/monitor.svg" alt={product.title} />
  const main = (
    <div className="product-item__main">
      <span className="product-item__name">{product.title}</span>
      <span className="product-item__sn">SN-{product.serialNumber}</span>
    </div>
  )
  const trash = onDelete && (
    <button className="icon-btn" onClick={() => onDelete(product)} aria-label={t('common.delete')}>
      <TrashIcon />
    </button>
  )

  if (variant === 'compact') {
    return (
      <div className="product-item product-item--compact">
        <span className={`product-item__dot ${dotClass}`} />
        {photo}
        {main}
        {onDelete && <span className={`product-item__status ${statusClass}`}>{t(`status.${product.status}`)}</span>}
        {trash}
      </div>
    )
  }

  return (
    <div className="product-item product-item--full">
      <span className={`product-item__dot ${dotClass}`} />
      {photo}
      {main}
      <span className={`product-item__status ${statusClass}`}>{t(`status.${product.status}`)}</span>

      <div className="product-item__guarantee">
        <div>{t('products.from')} {numericDate(product.guarantee.start)}</div>
        <div>{t('products.to')} {numericDate(product.guarantee.end)}</div>
        <div className="product-item__muted">
          {longDate(product.guarantee.start, lang)} — {longDate(product.guarantee.end, lang)}
        </div>
      </div>

      <span className="product-item__type">{product.type}</span>

      <div className="product-item__price">
        <small>{money(priceOf(product, 'USD'))} $</small>
        <div>
          {money(priceOf(product, 'UAH'))} <small>UAH</small>
        </div>
      </div>

      <span className="product-item__order">{orderTitle || '—'}</span>
      {trash}
    </div>
  )
}
