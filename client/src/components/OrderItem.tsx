'use client'

import { useTranslation } from 'react-i18next'
import { ListIcon, TrashIcon } from './Icons'
import { longDate, money, shortDate } from '@/lib/format'
import type { Lang, Order, Product, Totals } from '@/types'

interface Props {
  order: Order
  products: Product[]
  totals: Totals
  compact: boolean
  active: boolean
  onSelect: (id: number) => void
  onDelete: (order: Order) => void
}

export default function OrderItem({ order, products, totals, compact, active, onSelect, onDelete }: Props) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Lang
  const classes = ['order-item']
  if (compact) classes.push('order-item--compact')
  if (active) classes.push('order-item--active')

  return (
    <div
      className={classes.join(' ')}
      onClick={() => onSelect(order.id)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(order.id)}
    >
      {!compact && <span className="order-item__title">{order.title}</span>}

      <span className="order-item__icon"><ListIcon /></span>

      <div className="order-item__count">
        <strong>{products.length}</strong>
        <span>{t('orders.productsLabel')}</span>
      </div>

      <div className="order-item__date">
        <small>{shortDate(order.date)}</small>
        <div>{longDate(order.date, lang)}</div>
      </div>

      {!compact && (
        <div className="order-item__total">
          <small>{money(totals.USD)} $</small>
          <div>
            {money(totals.UAH)} <small>UAH</small>
          </div>
        </div>
      )}

      {!compact && (
        <button
          className="icon-btn"
          aria-label={t('common.delete')}
          onClick={e => {
            e.stopPropagation()
            onDelete(order)
          }}
        >
          <TrashIcon />
        </button>
      )}

      {compact && active && <span className="order-item__arrow">›</span>}
    </div>
  )
}
