import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';

import { selectItem } from '../slices/selectedItem';
import { changeItem as changeItemStore } from '../slices/items';
import { GroupItem, isCluster, isGroup, Item, Kind, ProductItem } from '../types/item';

const useItems = () => {
  const { value: items } = useSelector((state: RootState) => state.items);
  const { value: selectedItem } = useSelector((state: RootState) => state.selectedItem);
  const dispatch = useDispatch<AppDispatch>();

  const [itemsWithoutRelations, itemsWithRelations] = useMemo(() => {
    const itemUuidsWithoutRelation: string[] = [];
    const itemUuidsWithRelation: string[] = [];

    items.forEach((item) => {
      if (item.kind === Kind.ITEM) {
        if (item.groupUuid) {
          itemUuidsWithRelation.push(item.uuid);
          if (!itemUuidsWithRelation.includes(item.groupUuid)) {
            itemUuidsWithRelation.push(item.groupUuid);
          }
        } else {
          itemUuidsWithoutRelation.push(item.uuid);
        }
      }
      if (item.kind === Kind.GROUP) {
        if (item.clusterUuid) {
          itemUuidsWithRelation.push(item.uuid);
          if (!itemUuidsWithRelation.includes(item.clusterUuid)) {
            itemUuidsWithRelation.push(item.clusterUuid);
          }
        } else {
          itemUuidsWithoutRelation.push(item.uuid);
        }
      }
    });

    items.forEach((item) => {
      if (item.kind === Kind.CLUSTER && !itemUuidsWithRelation.includes(item.uuid)) {
        itemUuidsWithoutRelation.push(item.uuid);
      }
    });

    return [
      items.filter((item) => itemUuidsWithoutRelation.includes(item.uuid)),
      items.filter((item) => itemUuidsWithRelation.includes(item.uuid)),
    ];
  }, [items]);

  const groups = useMemo(() => {
    return items.filter(isGroup);
  }, [items]);

  const clusters = useMemo(() => {
    return items.filter(isCluster);
  }, [items]);

  const onSelectItem = useCallback(
    (item?: Item | null) => {
      dispatch(selectItem(item));
    },
    [dispatch],
  );

  const undoLastChange = useCallback(() => {
    dispatch(undoLastChange);
  }, [dispatch]);

  const changeProductItem = useCallback(
    (beforeItem: ProductItem, afterItem: Partial<ProductItem>) => {
      dispatch(changeItemStore({ beforeChangeItem: beforeItem, afterChangeItem: { ...beforeItem, ...afterItem } }));
    },
    [dispatch],
  );

  const changeGroupItem = useCallback(
    (beforeItem: GroupItem, afterItem: Partial<GroupItem>) => {
      dispatch(changeItemStore({ beforeChangeItem: beforeItem, afterChangeItem: { ...beforeItem, ...afterItem } }));
    },
    [dispatch],
  );

  return {
    items,
    groups,
    clusters,
    itemsWithoutRelations,
    itemsWithRelations,
    selectedItem,
    onSelectItem,
    changeProductItem,
    changeGroupItem,
  };
};

export default useItems;
