'use client'

import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { ValidationError, Validator } from '@/lib/validators'

export interface FieldConfig {
  name: string
  labelKey: string
  type?: 'text' | 'number' | 'password'
  validate?: Validator
}

interface Props {
  title: string
  fields: FieldConfig[]
  submitLabel?: string
  onSubmit: (values: Record<string, string>) => void
  onClose: () => void
}

export default function FormModal({ title, fields, submitLabel, onSubmit, onClose }: Props) {
  const { t } = useTranslation()
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(fields.map(f => [f.name, ''])))
  const [errors, setErrors] = useState<Record<string, ValidationError>>({})

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const found: Record<string, ValidationError> = {}
    fields.forEach(f => {
      const error = f.validate?.(values[f.name].trim())
      if (error) found[f.name] = error
    })
    setErrors(found)
    if (Object.keys(found).length === 0) onSubmit(values)
  }

  return (
    <div className="modal-layer" onClick={onClose}>
      <form className="form-modal" onClick={e => e.stopPropagation()} onSubmit={handleSubmit} noValidate>
        <button type="button" className="confirm-modal__close" onClick={onClose} aria-label={t('common.close')}>×</button>
        <h2 className="form-modal__title">{title}</h2>

        {fields.map(f => (
          <div className="mb-3" key={f.name}>
            <label className="form-label form-modal__label" htmlFor={f.name}>{t(f.labelKey)}</label>
            <input
              id={f.name}
              className={`form-control${errors[f.name] ? ' is-invalid' : ''}`}
              type={f.type ?? 'text'}
              value={values[f.name]}
              onChange={e => setValues({ ...values, [f.name]: e.target.value })}
            />
            {errors[f.name] && (
              <div className="invalid-feedback">{t(errors[f.name].key, errors[f.name].values)}</div>
            )}
          </div>
        ))}

        <div className="form-modal__footer">
          <button type="button" className="btn btn-link text-secondary" onClick={onClose}>{t('common.cancelShort')}</button>
          <button type="submit" className="btn btn-success">{submitLabel ?? t('common.add')}</button>
        </div>
      </form>
    </div>
  )
}
