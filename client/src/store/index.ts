import { configureStore } from '@reduxjs/toolkit'
import auth from './authSlice'
import orders from './ordersSlice'
import products from './productsSlice'
import ui from './uiSlice'

// Фабрика: у Next.js (SSR) на кожен запит потрібен свій store
export const makeStore = () => configureStore({ reducer: { auth, orders, products, ui } })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
