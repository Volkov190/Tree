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
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    selectItem: (state, action: PayloadAction<Item | null | undefined>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = action.payload || null;
    },
  },
});

export const { selectItem } = selectedItemSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state: RootState) => state.counter.value;

// // We can also write thunks by hand, which may contain both sync and async logic.
// // Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState());
//     if (currentValue % 2 === 1) {
//       dispatch(incrementByAmount(amount));
//     }
//   };

export default selectedItemSlice.reducer;
