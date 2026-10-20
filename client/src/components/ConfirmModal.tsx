'use client'

import { useTranslation } from 'react-i18next'
import { TrashIcon } from './Icons'
import ProductItem from './ProductItem'
import type { Product } from '@/types'

interface Props {
  title: string
  products?: Product[]
  onCancel: () => void
  onConfirm: () => void
}

export default function ConfirmModal({ title, products = [], onCancel, onConfirm }: Props) {
  const { t } = useTranslation()

  return (
    <div className="modal-layer" onClick={onCancel}>
      <div className="confirm-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="confirm-modal__close" onClick={onCancel} aria-label={t('common.close')}>×</button>
        <h2 className="confirm-modal__title">{title}</h2>

        {products.length > 0 && (
          <div className="confirm-modal__list">
            {products.map(p => (
              <ProductItem key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="confirm-modal__footer">
          <button className="confirm-modal__cancel" onClick={onCancel}>{t('common.cancel')}</button>
          <button className="confirm-modal__delete" onClick={onConfirm}>
            <TrashIcon /> {t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  )
}
