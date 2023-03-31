import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Item } from '../types/item';

export interface SelectedItemState {
  value: Item | null;
}

const initialState: SelectedItemState = {
  value: null,
};

export const selectedItemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    selectItem: (state, action: PayloadAction<Item | null | undefined>) => {
      state.value = action.payload || null;
    },
  },
});

export const { selectItem } = selectedItemSlice.actions;

export default selectedItemSlice.reducer;
