import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FormModal, { type FieldConfig } from './FormModal'
import { compose, minLength, required } from '@/lib/validators'

const fields: FieldConfig[] = [
  { name: 'title', labelKey: 'fields.orderTitle', validate: compose(required, minLength(3)) },
  { name: 'description', labelKey: 'fields.description' }
]

describe('<FormModal />', () => {
  it('shows validation errors and does not submit an invalid form', async () => {
    const onSubmit = vi.fn()
    render(<FormModal title="Новый приход" fields={fields} onSubmit={onSubmit} onClose={() => {}} />)

    await userEvent.click(screen.getByRole('button', { name: 'Добавить' }))
    expect(screen.getByText('Обязательное поле')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()

    await userEvent.type(screen.getByLabelText('Название прихода'), 'ab')
    await userEvent.click(screen.getByRole('button', { name: 'Добавить' }))
    expect(screen.getByText('Минимум 3 символа')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits valid values', async () => {
    const onSubmit = vi.fn()
    render(<FormModal title="Новый приход" fields={fields} onSubmit={onSubmit} onClose={() => {}} />)

    await userEvent.type(screen.getByLabelText('Название прихода'), 'Новый приход')
    await userEvent.click(screen.getByRole('button', { name: 'Добавить' }))
    expect(onSubmit).toHaveBeenCalledWith({ title: 'Новый приход', description: '' })
  })
})
