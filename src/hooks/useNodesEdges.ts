import { useMemo } from 'react';
import { Edge, Node } from 'reactflow';
import { NODE_HEIGHT, NODE_WIDTH } from '../const/tree';
import { Item, ItemId, Kind, NodeType, isGroup, isProduct, truthy } from '../types/item';

const edgeType = 'smoothstep';

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

export const useNodesEdges = (items: Item[]) => {
  const nodes = useMemo(
    () =>
      items.map(
        (item): Node<Item & { label: string }> => ({
          id: item.uuid,
          type: getType(item.kind),
          data: { ...item, label: item.name },
          position: { x: 0, y: 0 },
          style: { width: `${NODE_WIDTH}px`, height: `${NODE_HEIGHT}px` },
        }),
      ),
    [items],
  );

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

    return items
      .map((item): Edge => {
        const itemId = item.uuid;
        const itemParentId = parentsMap.get(itemId);
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
  }, [items]);
  return { nodes, edges };
};
