import { tree, stratify } from 'd3-hierarchy';
import { useMemo } from 'react';
import { Edge, Node, Position } from 'reactflow';
import { NODE_HEIGHT, NODE_STEP_HEIGHT, NODE_WIDTH, NODE_STEP_WIDTH } from '../const/tree';
import { Item, ItemId } from '../types/item';
import { useNodesEdges } from './useNodesEdges';

const getLayoutedElements = (nodes: Node<Item>[], edges: Edge[]) => {
  if (!nodes.length || !edges.length) return { nodes, edges };
  const map = new Map<string, string[]>();
  nodes.forEach((node) => map.set(node.id, []));
  edges.forEach((edge) => {
    const newArray = map.get(edge.target) || [];
    newArray.push(edge.source);
    map.set(edge.target, newArray);
  });
  const root = stratify()
    .id((d) => (d as Node<Item>).id)
    .parentId((d) => map.get((d as Node<Item>).id) as any)(nodes);
  const itemsTree = tree()
    // @NOTE: расстояние между продуктами константное
    .separation(() => 1)
    .nodeSize([NODE_HEIGHT + NODE_STEP_HEIGHT, NODE_WIDTH + NODE_STEP_WIDTH])(root);
  const newNodes: Node<Item>[] = [];
  itemsTree.each((node1) => {
    const node = node1 as d3.HierarchyPointNode<Node<Item>>;
    node.data.targetPosition = Position.Left;
    node.data.sourcePosition = Position.Right;
    node.data.position = {
      x: node.y,
      y: node.x,
    };
    newNodes.push(node.data);
  });
  return { nodes, edges };
};

export const useLayout = (items: Item[], options?: { isWithoutProducts?: boolean; isWithoutCluster?: boolean }) => {
  const nodesEdges = useNodesEdges(items, options);

  const result = useMemo(() => {
    const targetIds = new Set<ItemId>();
    const sourceIds = new Set<ItemId>();
    nodesEdges.edges.forEach((edge) => {
      targetIds.add(edge.target);
      sourceIds.add(edge.source);
    });

    const nodes = nodesEdges.nodes.filter((node) => targetIds.has(node.id) || sourceIds.has(node.id));

    return getLayoutedElements(nodes, nodesEdges.edges);
  }, [nodesEdges.edges, nodesEdges.nodes]);

  return result;
};
