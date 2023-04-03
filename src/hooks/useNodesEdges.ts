import { useMemo } from 'react';
import { Edge, Node } from 'reactflow';
import { NODE_HEIGHT, NODE_WIDTH } from '../const/tree';
import { Item, ItemId, Kind, NodeType, isGroup, isProduct, truthy } from '../types/item';
import useItems from './useItems';

const edgeType = 'smoothstep';
const EMPTY_NODE_ID = 'empty';

const getType = (itemKind: Kind) => {
  switch (itemKind) {
    case Kind.CLUSTER:
      return NodeType.INPUT;
    case Kind.GROUP:
      return NodeType.DEFAULT;
    case Kind.ITEM:
      return NodeType.OUTPUT;

    default: {
      const errorType: never = itemKind;
      console.error(`Неизвестный тип элемента ${errorType}`);
    }
  }
};

function getId(item: Item) {
  return `${item.kind}_${item.uuid}`;
}

export const useNodesEdges = (items: Item[], options?: { isWithoutProducts?: boolean; isWithoutCluster?: boolean }) => {
  const { isWithoutProducts, isWithoutCluster } = options || {};
  const { groups, clusters } = useItems();

  const nodes = useMemo(() => {
    const resNodes = items.map(
      (item): Node<Item & { label: string }> => ({
        id: getId(item),
        type: getType(item.kind),
        data: { ...item, label: item.name },
        position: { x: 0, y: 0 },
        style: { width: `${NODE_WIDTH}px`, height: `${NODE_HEIGHT}px` },
      }),
    );

    if (isWithoutProducts || isWithoutCluster) {
      resNodes.push({
        id: EMPTY_NODE_ID,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: { label: '' } as any,
        position: { x: 0, y: 0 },
        style: { visibility: 'hidden' },
      });
    }

    return resNodes;
  }, [isWithoutCluster, isWithoutProducts, items]);

  const edges = useMemo<Edge[]>(() => {
    const parentsMap = new Map<ItemId, ItemId>();

    items.forEach((item) => {
      if (isProduct(item) && item.groupUuid) {
        parentsMap.set(getId(item), getId(groups.find((group) => group.uuid === item.groupUuid)!));
        return;
      }
      if (isGroup(item) && item.clusterUuid) {
        parentsMap.set(getId(item), getId(clusters.find((cluster) => cluster.uuid === item.clusterUuid)!));
        return;
      }
    });

    const someGroupId = getId(items.find(isGroup)!);

    let resEdges = items
      .map((item): Edge => {
        const itemId = getId(item);
        const itemParentId = parentsMap.get(itemId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!itemParentId) return null as any;
        return {
          id: `e${itemId}${itemParentId}`,
          target: itemId,
          source: itemParentId,
          type: edgeType,
          animated: !item.important,
        };
      })
      .filter(truthy);

    if (isWithoutProducts) {
      resEdges.push({
        id: `${EMPTY_NODE_ID}${someGroupId}`,
        target: EMPTY_NODE_ID,
        source: someGroupId,
        style: { visibility: 'hidden' },
      });
    }

    if (isWithoutCluster) {
      const curGroupId = getId(items.find(isGroup)!);

      resEdges.push({
        id: `${curGroupId}${EMPTY_NODE_ID}`,
        target: curGroupId,
        source: EMPTY_NODE_ID,
        style: { visibility: 'hidden' },
      });
    }

    return resEdges;
  }, [clusters, groups, isWithoutCluster, isWithoutProducts, items]);
  return { nodes, edges };
};
