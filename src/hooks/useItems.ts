import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';

import { selectItem, changeItem as changeItemStore, changeItems as changeItemsStore } from '../slices/items';
import { GroupItem, isCluster, isGroup, Item, Kind, ProductItem, History, isProduct } from '../types/item';

const useItems = () => {
  const { value: items } = useSelector((state: RootState) => state.items);
  const { selectedItem } = useSelector((state: RootState) => state.items);
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

  const products = useMemo(() => {
    return items.filter(isProduct);
  }, [items]);

  const groups = useMemo(() => {
    return items.filter(isGroup);
  }, [items]);

  const clusters = useMemo(() => {
    return items.filter(isCluster);
  }, [items]);

  const trees = useMemo(() => {
    const clustersWithRelations = itemsWithRelations.filter((item) => item.kind === Kind.CLUSTER);

    return clustersWithRelations
      .map((cluster) => {
        const usedGroups = itemsWithRelations.filter(
          (item) => item.kind === Kind.GROUP && item.clusterUuid === cluster.uuid,
        );
        const usedProducts = itemsWithRelations.filter(
          (item) => item.kind === Kind.ITEM && usedGroups.map((group) => group.uuid).includes(item.groupUuid || ''),
        );

        return [cluster, ...usedGroups, ...usedProducts];
      })
      .filter((tree) => {
        let isWithGroup = false;
        let isWithProduct = false;

        tree.forEach((item) => {
          if (item.kind === Kind.GROUP) {
            isWithGroup = true;
          }
          if (item.kind === Kind.ITEM) {
            isWithProduct = true;
          }
        });

        return isWithGroup && isWithProduct;
      });
  }, [itemsWithRelations]);

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

  const changeGroupItems = useCallback(
    (historyItems: History) => {
      dispatch(changeItemsStore(historyItems));
    },
    [dispatch],
  );

  return {
    items,
    products,
    groups,
    clusters,
    itemsWithoutRelations,
    itemsWithRelations,
    selectedItem,
    trees,
    onSelectItem,
    changeProductItem,
    changeGroupItem,
    changeGroupItems,
  };
};

export default useItems;
