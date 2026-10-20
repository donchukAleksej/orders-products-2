import { beforeEach, describe, expect, it } from 'vitest'
import { makeStore, type AppStore } from './index'
import { hydrate, logout } from './authSlice'
import { selectOrder } from './ordersSlice'
import { setTypeFilter } from './productsSlice'
import { addProduct, deleteOrder, deleteProduct, fetchOrders, fetchProducts, login } from './thunks'
import type { Order, Product } from '@/types'

const order = (id: number): Order => ({ id, title: `Order ${id}`, date: '2017-06-29 12:09:33', description: '' })
const product = (id: number, orderId: number): Product => ({
  id,
  serialNumber: id,
  isNew: 1,
  photo: '',
  title: `Product ${id}`,
  type: 'Monitors',
  specification: '',
  status: 'free',
  guarantee: { start: '2017-04-06 12:09:33', end: '2025-08-06 12:09:33' },
  price: [{ value: 1, symbol: 'USD', isDefault: 0 }],
  order: orderId,
  date: '2017-06-29 12:09:33'
})

let store: AppStore

beforeEach(() => {
  store = makeStore()
  store.dispatch(fetchOrders.fulfilled([order(1), order(2)], 'req'))
  store.dispatch(fetchProducts.fulfilled([product(1, 1), product(2, 1), product(3, 2)], 'req'))
})

describe('orders slice', () => {
  it('stores fetched orders', () => {
    expect(store.getState().orders.items).toHaveLength(2)
    expect(store.getState().orders.status).toBe('ready')
  })

  it('selects an order', () => {
    store.dispatch(selectOrder(2))
    expect(store.getState().orders.selectedId).toBe(2)
  })

  it('clears the selection when the selected order is deleted', () => {
    store.dispatch(selectOrder(2))
    store.dispatch(deleteOrder.fulfilled(2, 'req', 2))
    expect(store.getState().orders.items.map(o => o.id)).toEqual([1])
    expect(store.getState().orders.selectedId).toBeNull()
  })
})

describe('products slice', () => {
  it('removes all products of a deleted order', () => {
    store.dispatch(deleteOrder.fulfilled(1, 'req', 1))
    expect(store.getState().products.items.map(p => p.id)).toEqual([3])
  })

  it('removes a single product', () => {
    store.dispatch(deleteProduct.fulfilled(2, 'req', 2))
    expect(store.getState().products.items.map(p => p.id)).toEqual([1, 3])
  })

  it('adds a product', () => {
    store.dispatch(addProduct.fulfilled(product(10, 2), 'req', { orderId: 2, data: {} }))
    expect(store.getState().products.items).toHaveLength(4)
  })

  it('keeps the type filter', () => {
    store.dispatch(setTypeFilter('Laptops'))
    expect(store.getState().products.typeFilter).toBe('Laptops')
  })
})

describe('auth slice', () => {
  it('hydrates from storage data', () => {
    store.dispatch(hydrate({ token: 'abc', username: 'admin' }))
    expect(store.getState().auth).toMatchObject({ token: 'abc', username: 'admin', hydrated: true })
  })

  it('stores the token after login', () => {
    store.dispatch(login.fulfilled({ token: 't', user: { username: 'admin' } }, 'req', { username: 'admin', password: 'x' }))
    expect(store.getState().auth.token).toBe('t')
  })

  it('logs out', () => {
    store.dispatch(hydrate({ token: 'abc', username: 'admin' }))
    store.dispatch(logout())
    expect(store.getState().auth.token).toBeNull()
    expect(store.getState().auth.hydrated).toBe(true)
  })
})
