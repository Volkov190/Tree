import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';

import { selectItem } from '../slices/selectedItem';
import { changeItem as changeItemStore } from '../slices/items';
import { Item, ProductItem } from '../types/item';

const useItems = () => {
  const { value: items } = useSelector((state: RootState) => state.items);
  const { value: selectedItem } = useSelector((state: RootState) => state.selectedItem);
  const dispatch = useDispatch<AppDispatch>();

  const onSelectItem = useCallback(
    (item?: Item) => {
      dispatch(selectItem(item));
    },
    [dispatch],
  );

  const undoLastChange = useCallback(() => {
    dispatch(undoLastChange);
  }, [dispatch]);

  const changeProductItem = useCallback((beforeItem: ProductItem, afterItem: Partial<ProductItem>) => {
    dispatch(changeItemStore({ beforeChangeItem: beforeItem, afterChangeItem: { ...beforeItem, ...afterItem } }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    items,
    selectedItem,
    onSelectItem,
    changeProductItem,
  };
};

export default useItems;
