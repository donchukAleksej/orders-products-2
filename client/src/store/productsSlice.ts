import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '@/types'
import { addProduct, deleteOrder, deleteProduct, fetchProducts } from './thunks'

interface ProductsState {
  items: Product[]
  typeFilter: string
  status: 'idle' | 'loading' | 'ready' | 'error'
}

const initialState: ProductsState = { items: [], typeFilter: '', status: 'idle' }

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setTypeFilter: (state, { payload }: PayloadAction<string>) => {
      state.typeFilter = payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, s => {
        s.status = 'loading'
      })
      .addCase(fetchProducts.fulfilled, (s, { payload }) => {
        s.status = 'ready'
        s.items = payload
      })
      .addCase(fetchProducts.rejected, s => {
        s.status = 'error'
      })
      .addCase(addProduct.fulfilled, (s, { payload }) => {
        s.items.push(payload)
      })
      .addCase(deleteProduct.fulfilled, (s, { payload }) => {
        s.items = s.items.filter(p => p.id !== payload)
      })
      // видалення приходу видаляє всі його продукти
      .addCase(deleteOrder.fulfilled, (s, { payload }) => {
        s.items = s.items.filter(p => p.order !== payload)
      })
  }
})

export const { setTypeFilter } = productsSlice.actions
export default productsSlice.reducer
