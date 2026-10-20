'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { login } from '@/store/thunks'
import { required, type ValidationError } from '@/lib/validators'
import LanguageSwitcher from './LanguageSwitcher'

export default function LoginForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { token, hydrated, status } = useAppSelector(s => s.auth)
  const [values, setValues] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState<Partial<Record<'username' | 'password', ValidationError>>>({})

  useEffect(() => {
    if (hydrated && token) router.replace('/orders')
  }, [hydrated, token, router])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const found = {
      username: required(values.username.trim()) ?? undefined,
      password: required(values.password) ?? undefined
    }
    setErrors(found)
    if (!found.username && !found.password) dispatch(login({ username: values.username.trim(), password: values.password }))
  }

  return (
    <div className="login">
      <form className="login__form page-transition" onSubmit={submit} noValidate>
        <div className="login__lang"><LanguageSwitcher /></div>
        <h1 className="login__title">{t('login.title')}</h1>

        {(['username', 'password'] as const).map(name => (
          <div className="mb-3" key={name}>
            <label className="form-label form-modal__label" htmlFor={name}>{t(`login.${name}`)}</label>
            <input
              id={name}
              className={`form-control${errors[name] ? ' is-invalid' : ''}`}
              type={name === 'password' ? 'password' : 'text'}
              autoComplete={name === 'password' ? 'current-password' : 'username'}
              value={values[name]}
              onChange={e => setValues({ ...values, [name]: e.target.value })}
            />
            {errors[name] && <div className="invalid-feedback">{t(errors[name]!.key)}</div>}
          </div>
        ))}

        {status === 'error' && <div className="alert alert-danger py-2">{t('login.error')}</div>}

        <button className="btn btn-success w-100" type="submit" disabled={status === 'loading'}>
          {t('login.submit')}
        </button>
        <p className="login__hint">{t('login.hint')}</p>
      </form>
    </div>
  )
}
