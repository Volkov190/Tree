import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import itemsReducer from '../slices/items';
import selectedItemReducer from '../slices/selectedItem';

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    selectedItem: selectedItemReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export {};
