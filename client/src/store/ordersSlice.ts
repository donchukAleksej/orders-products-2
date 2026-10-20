import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Order } from '@/types'
import { addOrder, deleteOrder, fetchOrders } from './thunks'

interface OrdersState {
  items: Order[]
  selectedId: number | null
  status: 'idle' | 'loading' | 'ready' | 'error'
}

const initialState: OrdersState = { items: [], selectedId: null, status: 'idle' }

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    selectOrder: (state, { payload }: PayloadAction<number | null>) => {
      state.selectedId = payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchOrders.pending, s => {
        s.status = 'loading'
      })
      .addCase(fetchOrders.fulfilled, (s, { payload }) => {
        s.status = 'ready'
        s.items = payload
      })
      .addCase(fetchOrders.rejected, s => {
        s.status = 'error'
      })
      .addCase(addOrder.fulfilled, (s, { payload }) => {
        s.items.unshift(payload)
      })
      .addCase(deleteOrder.fulfilled, (s, { payload }) => {
        s.items = s.items.filter(o => o.id !== payload)
        if (s.selectedId === payload) s.selectedId = null
      })
  }
})

export const { selectOrder } = ordersSlice.actions
export default ordersSlice.reducer
