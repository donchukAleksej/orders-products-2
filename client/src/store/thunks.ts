import { createAsyncThunk } from '@reduxjs/toolkit'
import api from './api'
import { KEYS, storage } from '@/lib/storage'
import type { Order, Product } from '@/types'

export const fetchOrders = createAsyncThunk('orders/fetch', async () => (await api.get<Order[]>('/orders')).data)

export const addOrder = createAsyncThunk('orders/add', async (data: { title: string; description?: string }) =>
  (await api.post<Order>('/orders', data)).data
)

export const deleteOrder = createAsyncThunk('orders/delete', async (id: number) => {
  await api.delete(`/orders/${id}`)
  return id
})

export const fetchProducts = createAsyncThunk('products/fetch', async () => (await api.get<Product[]>('/products')).data)

export const addProduct = createAsyncThunk(
  'products/add',
  async ({ orderId, data }: { orderId: number; data: Record<string, string> }) =>
    (await api.post<Product>(`/orders/${orderId}/products`, data)).data
)

export const deleteProduct = createAsyncThunk('products/delete', async (id: number) => {
  await api.delete(`/products/${id}`)
  return id
})

export interface LoginResult {
  token: string
  user: { username: string }
}

export const login = createAsyncThunk('auth/login', async (credentials: { username: string; password: string }) => {
  const { data } = await api.post<LoginResult>('/auth/login', credentials)
  storage.set(KEYS.token, data.token)
  storage.set(KEYS.user, data.user.username)
  return data
})
