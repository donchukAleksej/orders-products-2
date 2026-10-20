import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: { search: '' },
  reducers: {
    setSearch: (state, { payload }: PayloadAction<string>) => {
      state.search = payload
    }
  }
})

export const { setSearch } = uiSlice.actions
export default uiSlice.reducer
