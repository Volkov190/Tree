import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isEqual } from 'lodash';
import fetchItems from '../fetchers/fetchItems';
import { GroupItem, History, HistoryNode, isCluster, isGroup, isProduct, Item, Kind, ProductItem } from '../types/item';

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

        if (isEqual(state.selectedItem, beforeChangeItem)) {
          state.selectedItem = afterChangeItem;
        }
      });
      state.histories = [...state.histories, history];
    },

    deleteUnimportantItems: (state) => {
      const unimportantClusters = state.value.filter(isCluster).filter((cluster) => !cluster.important);
      const unimportantGroups = state.value.filter(isGroup).filter((cluster) => !cluster.important);
      const unimportantProducts = state.value.filter(isProduct).filter((cluster) => !cluster.important);

      const currentHistory: History = [];

      [...unimportantClusters, ...unimportantGroups, ...unimportantProducts].forEach((item) =>
        currentHistory.push({ beforeChangeItem: item, afterChangeItem: null }),
      );

      const unimportantClusterUuids = unimportantClusters.map((item) => item.uuid);

      const newItems = state.value
        .filter((item) => item.important)
        .map((item) => {
          if (item.kind === Kind.GROUP && unimportantClusterUuids.includes(item.clusterUuid || '')) {
            currentHistory.push({ beforeChangeItem: item, afterChangeItem: { ...item, clusterUuid: null } });
            return { ...item, clusterUuid: null } as GroupItem;
          }
          if (item.kind === Kind.ITEM && item.groupUuid) {
            const productGroup = state.value.filter(isGroup).find((group) => group.uuid === item.groupUuid);
            if (
              productGroup &&
              (unimportantClusterUuids.includes(productGroup.clusterUuid || '') || !productGroup.important)
            ) {
              currentHistory.push({ beforeChangeItem: item, afterChangeItem: { ...item, groupUuid: null } });
              return { ...item, groupUuid: null } as ProductItem;
            }
          }

          return item;
        });

      state.histories = [...state.histories, currentHistory];
      state.value = newItems;
    },

    selectItem: (state, action: PayloadAction<Item | null | undefined>) => {
      state.selectedItem = action.payload || null;
    },

    undoLastChange: (state) => {
      if (!state.histories.length) return;

      const history = state.histories[state.histories.length - 1];
      history.forEach(({ afterChangeItem, beforeChangeItem }) => {
        if (isEqual(afterChangeItem, state.selectedItem)) {
          state.selectedItem = beforeChangeItem;
        }

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

export const { changeItem, undoLastChange, selectItem, deleteUnimportantItems, changeItems } = itemsSlice.actions;

export default itemsSlice.reducer;
