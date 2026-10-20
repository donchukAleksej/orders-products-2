import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmModal from './ConfirmModal'
import type { Product } from '@/types'

const product: Product = {
  id: 1,
  serialNumber: 1234,
  isNew: 1,
  photo: '',
  title: 'Gigabyte X58',
  type: 'Monitors',
  specification: '',
  status: 'free',
  guarantee: { start: '2017-04-06 12:09:33', end: '2025-08-06 12:09:33' },
  price: [],
  order: 1,
  date: '2017-06-29 12:09:33'
}

describe('<ConfirmModal />', () => {
  it('shows the question and the products to delete', () => {
    render(<ConfirmModal title="Удалить приход?" products={[product]} onCancel={() => {}} onConfirm={() => {}} />)
    expect(screen.getByText('Удалить приход?')).toBeInTheDocument()
    expect(screen.getByText('Gigabyte X58')).toBeInTheDocument()
    expect(screen.getByText('SN-1234')).toBeInTheDocument()
  })

  it('calls onConfirm when "Удалить" is pressed', async () => {
    const onConfirm = vi.fn()
    render(<ConfirmModal title="?" onCancel={() => {}} onConfirm={onConfirm} />)
    await userEvent.click(screen.getByRole('button', { name: 'Удалить' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when "Отменить" is pressed', async () => {
    const onCancel = vi.fn()
    render(<ConfirmModal title="?" onCancel={onCancel} onConfirm={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: 'Отменить' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
