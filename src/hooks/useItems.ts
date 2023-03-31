import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';

import { selectItem } from '../slices/selectedItem';
import { Item } from '../types/item';

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

  return {
    items,
    selectedItem,
    onSelectItem,
  };
};

export default useItems;
