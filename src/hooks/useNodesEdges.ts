import { useMemo } from 'react';
import { Edge, Node } from 'reactflow';
import { Item, ItemId, Kind, NodeType, isCluster, isGroup, isProduct, truthy } from '../types/item';
import useItems from './useItems';
const edgeType = 'smoothstep';
const rooltId = 'root';

const getType = (itemKind: Kind) => {
  switch (itemKind) {
    case Kind.CLUSTER:
      return NodeType.DEFAULT;
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

export const useNodesEdges = () => {
  const { items } = useItems();

  const nodes = useMemo<Node<Item>[]>(() => {
    return [
      {
        id: rooltId,
        type: NodeType.INPUT,
        data: { label: rooltId } as any,
        position: { x: 0, y: 0 },
      },
      ...items.map((item) => ({
        id: item.uuid,
        type: getType(item.kind),
        data: { ...item, label: item.name },
        position: { x: 0, y: 0 },
      })),
    ];
  }, [items]);

  const edges = useMemo<Edge[]>(() => {
    const parentsMap = new Map<ItemId, ItemId>();

    items.forEach((item) => {
      if (isProduct(item) && item.groupUuid) {
        parentsMap.set(item.uuid, item.groupUuid);
        return;
      }
      if (isGroup(item) && item.clusterUuid) {
        parentsMap.set(item.uuid, item.clusterUuid);
        return;
      }
    });

    const clusters = items.filter(isCluster);

    return [
      ...clusters.map((cluster) => ({
        id: `e${cluster.uuid}${rooltId}`,
        target: cluster.uuid,
        source: rooltId,
        type: edgeType,
        animated: true,
      })),
      ...items.map((item) => {
        const itemId = item.uuid;
        const itemParentId = parentsMap.get(itemId);
        if (!itemParentId) return;
        return {
          id: `e${itemId}${itemParentId}`,
          target: itemId,
          source: itemParentId,
          type: edgeType,
          animated: true,
        };
      }),
    ].filter(truthy);
  }, [items]);
  return { nodes, edges };
};
