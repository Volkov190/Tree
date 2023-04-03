import { useMemo } from 'react';
import { Kind, isGroup } from '../types/item';
import useItems from './useItems';
import useTreesMemo from './useTreesMemo';

const useTrees = () => {
  const { itemsWithRelations, items, products } = useItems();

  const clusterTrees = useMemo(() => {
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

  const fullTrees = useTreesMemo(
    useMemo(
      () =>
        clusterTrees.filter((tree) => {
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
      [clusterTrees],
    ),
  );

  const treesWithoutProducts = useTreesMemo(
    useMemo(
      () =>
        clusterTrees.filter((tree) => {
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
      [clusterTrees],
    ),
  );

  const treesWithoutClusters = useTreesMemo(
    useMemo(() => {
      const groups = items
        .filter(isGroup)
        .filter((group) => group.clusterUuid === null)
        .filter((group) => {
          return products.some((product) => product.groupUuid === group.uuid);
        });

      return groups.map((group) => [group, ...products.filter((product) => product.groupUuid === group.uuid)]);
    }, [items, products]),
  );

  return { treesWithoutClusters, treesWithoutProducts, fullTrees };
};

export default useTrees;
