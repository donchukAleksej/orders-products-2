import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { login } from './thunks'

interface AuthState {
  token: string | null
  username: string | null
  hydrated: boolean // чи вже прочитано Web Storage (на сервері завжди false)
  status: 'idle' | 'loading' | 'error'
}

const initialState: AuthState = { token: null, username: null, hydrated: false, status: 'idle' }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrate: (state, { payload }: PayloadAction<{ token: string | null; username: string | null }>) => {
      state.token = payload.token
      state.username = payload.username
      state.hydrated = true
    },
    logout: state => {
      state.token = null
      state.username = null
      state.status = 'idle'
    }
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, s => {
        s.status = 'loading'
      })
      .addCase(login.fulfilled, (s, { payload }) => {
        s.status = 'idle'
        s.token = payload.token
        s.username = payload.user.username
      })
      .addCase(login.rejected, s => {
        s.status = 'error'
      })
  }
})

export const { hydrate, logout } = authSlice.actions
export default authSlice.reducer
