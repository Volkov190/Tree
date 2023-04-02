import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import fetchItems from '../fetchers/fetchItems';
import { History, HistoryNode, Item } from '../types/item';

export interface ItemsState {
  initialValue: Item[];
  value: Item[];
  histories: History[];
  status: 'idle' | 'loading' | 'failed';
  selectedItem: Item | null;
}

const initialState: ItemsState = {
  initialValue: [],
  value: [],
  histories: [],
  selectedItem: null,
  status: 'idle',
};
export const fetchItemsThunk = createAsyncThunk('items/fetchItems', async () => {
  const response = await fetchItems();
  return response.data;
});

export const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    changeItem: (state, action: PayloadAction<HistoryNode>) => {
      const { beforeChangeItem, afterChangeItem } = action.payload;
      state.value = state.value
        .map((item) => {
          if (item.kind === beforeChangeItem.kind && item.uuid === beforeChangeItem.uuid) {
            return afterChangeItem;
          }
          return item;
        })
        .filter((item): item is Item => item !== null);
      state.selectedItem = afterChangeItem;
      state.histories = [...state.histories, [action.payload]];
    },

    changeItems: (state, action: PayloadAction<History>) => {
      const history = action.payload;
      history.forEach(({ beforeChangeItem, afterChangeItem }) => {
        state.value = state.value
          .map((item) => {
            if (item.kind === beforeChangeItem.kind && item.uuid === beforeChangeItem.uuid) {
              return afterChangeItem;
            }
            return item;
          })
          .filter((item): item is Item => item !== null);

        if (state.selectedItem?.uuid === beforeChangeItem.uuid && state.selectedItem?.kind === beforeChangeItem.kind) {
          state.selectedItem = afterChangeItem;
        }
      });
      state.histories = [...state.histories, history];
    },

    selectItem: (state, action: PayloadAction<Item | null | undefined>) => {
      state.selectedItem = action.payload || null;
    },

    undoLastChange: (state) => {
      if (!state.histories.length) return;

      const history = state.histories[state.histories.length - 1];
      history.forEach(({ afterChangeItem, beforeChangeItem }) => {
        if (afterChangeItem === null) {
          return (state.value = [...state.value, beforeChangeItem]);
        }

        state.value = state.value.map((item) => {
          if (item.kind === afterChangeItem.kind && item.uuid === afterChangeItem.uuid) {
            return beforeChangeItem;
          }
          return item;
        });
      });
      state.histories = state.histories.slice(0, -1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemsThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchItemsThunk.fulfilled, (state, action) => {
        state.status = 'idle';
        // типа deepClone
        state.initialValue = [...action.payload.map((item) => ({ ...item }))];
        state.value = action.payload;
      })
      .addCase(fetchItemsThunk.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { changeItem, changeItems, undoLastChange, selectItem } = itemsSlice.actions;

export default itemsSlice.reducer;
