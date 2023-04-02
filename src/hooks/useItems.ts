import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';

import { selectItem, changeItem, deleteUnimportantItems, undoLastChange, changeItems } from '../slices/items';
import { GroupItem, isCluster, isGroup, isProduct, Item, Kind, ProductItem, History } from '../types/item';

const useItems = () => {
  const { value: items, selectedItem, histories } = useSelector((state: RootState) => state.items);
  const dispatch = useDispatch<AppDispatch>();

  const products = useMemo(() => {
    return items.filter(isProduct);
  }, [items]);

  const groups = useMemo(() => {
    return items.filter(isGroup);
  }, [items]);

  const clusters = useMemo(() => {
    return items.filter(isCluster);
  }, [items]);

  const [itemsWithoutRelations, itemsWithRelations] = useMemo(() => {
    const itemsWithoutRelation: { uuid: string; kind: Kind }[] = [];
    const itemsWithRelation: { uuid: string; kind: Kind }[] = [];

    items.forEach((item) => {
      if (item.kind === Kind.ITEM) {
        if (item.groupUuid) {
          itemsWithRelation.push(item);
          if (!itemsWithRelation.find((_item) => _item.uuid === item.uuid && _item.kind === Kind.GROUP)) {
            itemsWithRelation.push({ uuid: item.groupUuid, kind: Kind.GROUP });
          }
        } else {
          itemsWithoutRelation.push(item);
        }
      }
      if (item.kind === Kind.GROUP) {
        let hasCluster = false;
        let hasProducts = false;
        if (item.clusterUuid) {
          itemsWithRelation.push({ uuid: item.clusterUuid, kind: Kind.CLUSTER });
          hasCluster = true;
        }
        if (products.find((product) => product.groupUuid === item.uuid)) {
          hasProducts = true;
        }

        if (hasCluster || hasProducts) {
          itemsWithRelation.push(item);
        } else {
          itemsWithoutRelation.push(item);
        }
      }
    });

    items.filter(isCluster).forEach((cluster) => {
      if (!itemsWithRelation.find((item) => item.uuid === cluster.uuid && item.kind === Kind.CLUSTER)) {
        itemsWithoutRelation.push(cluster);
      }
    });

    return [
      items.filter((item) =>
        itemsWithoutRelation.find((_item) => _item.uuid === item.uuid && _item.kind === item.kind),
      ),
      items.filter((item) => itemsWithRelation.find((_item) => _item.uuid === item.uuid && _item.kind === item.kind)),
    ];
  }, [items, products]);

  const trees = useMemo(() => {
    const clustersWithRelations = itemsWithRelations.filter((item) => item.kind === Kind.CLUSTER);

    return clustersWithRelations.map((cluster) => {
      const usedGroups = itemsWithRelations.filter(
        (item) => item.kind === Kind.GROUP && item.clusterUuid === cluster.uuid,
      );
      const usedProducts = itemsWithRelations.filter(
        (item) => item.kind === Kind.ITEM && usedGroups.map((group) => group.uuid).includes(item.groupUuid || ''),
      );

      return [cluster, ...usedGroups, ...usedProducts];
    });
  }, [itemsWithRelations]);

  const fullTrees = useMemo(
    () =>
      trees.filter((tree) => {
        let hasGroups = false;
        let hasProducts = false;

        tree.forEach((item) => {
          if (item.kind === Kind.GROUP) {
            hasGroups = true;
          }
          if (item.kind === Kind.ITEM) {
            hasProducts = true;
          }
        });

        return hasGroups && hasProducts;
      }),
    [trees],
  );

  const treesWithoutProducts = useMemo(
    () =>
      trees.filter((tree) => {
        let hasGroups = false;
        let hasProducts = false;

        tree.forEach((item) => {
          if (item.kind === Kind.GROUP) {
            hasGroups = true;
          }
          if (item.kind === Kind.ITEM) {
            hasProducts = true;
          }
        });

        return hasGroups && !hasProducts;
      }),
    [trees],
  );

  const treesWithoutClusters = useMemo(() => {
    const groups = items
      .filter(isGroup)
      .filter((group) => group.clusterUuid === null)
      .filter((group) => {
        return products.some((product) => product.groupUuid === group.uuid);
      });

    return groups.map((group) => [group, ...products.filter((product) => product.groupUuid === group.uuid)]);
  }, [items, products]);

  const hasHistory = useMemo(() => {
    return !!histories.length;
  }, [histories]);

  const hasUnimportantItems = useMemo(() => {
    return items.some((item) => !item.important);
  }, [items]);

  const onSelectItem = useCallback(
    (item?: Item | null) => {
      dispatch(selectItem(item));
    },
    [dispatch],
  );

  const onUndoLastChange = useCallback(() => {
    dispatch(undoLastChange());
  }, [dispatch]);

  const changeProductItem = useCallback(
    (beforeItem: ProductItem, afterItem: Partial<ProductItem>) => {
      dispatch(changeItem({ beforeChangeItem: beforeItem, afterChangeItem: { ...beforeItem, ...afterItem } }));
    },
    [dispatch],
  );

  const onChangeGroupItem = useCallback(
    (beforeItem: GroupItem, afterItem: Partial<GroupItem>) => {
      dispatch(changeItem({ beforeChangeItem: beforeItem, afterChangeItem: { ...beforeItem, ...afterItem } }));
    },
    [dispatch],
  );

  const onChangeItems = useCallback(
    (historyItems: History) => {
      dispatch(changeItems(historyItems));
    },
    [dispatch],
  );
  const onDeleteUnimportantItems = useCallback(() => {
    dispatch(deleteUnimportantItems());
  }, [dispatch]);

  return {
    items,
    products,
    groups,
    clusters,
    itemsWithoutRelations,
    itemsWithRelations,
    selectedItem,
    hasHistory,
    hasUnimportantItems,
    fullTrees,
    treesWithoutProducts,
    treesWithoutClusters,
    onSelectItem,
    changeProductItem,
    onChangeGroupItem,
    onDeleteUnimportantItems,
    onUndoLastChange,
    onChangeItems,
  };
};

export default useItems;
