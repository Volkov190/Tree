import * as d3 from 'd3-hierarchy';
import { useMemo } from 'react';
import { Edge, Node, Position } from 'reactflow';
import { Item, ItemId } from '../types/item';
import { useNodesEdges } from './useNodesEdges';

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: Node<Item>[], edges: Edge[]) => {
  if (!nodes.length || !edges.length) return { nodes, edges };
  const map = new Map<string, string[]>();
  nodes.forEach((node) => map.set(node.id, []));
  edges.forEach((edge) => {
    const newArray = map.get(edge.target) || [];
    newArray.push(edge.source);
    map.set(edge.target, newArray);
  });
  const root = d3
    .stratify()
    .id((d) => (d as Node<Item>).id)
    .parentId((d) => map.get((d as Node<Item>).id) as any)(nodes);
  const tree = d3.tree().nodeSize([nodeHeight * 2.5, nodeWidth * 1.5])(root);
  const newNodes: Node<Item>[] = [];
  tree.each((node1) => {
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

export const useLayout = () => {
  const nodesEdges = useNodesEdges();

  const result = useMemo(() => {
    const targetIds = new Set<ItemId>();
    const sourceIds = new Set<ItemId>();
    nodesEdges.edges.forEach((edge) => {
      targetIds.add(edge.target);
      sourceIds.add(edge.source);
    });

    const nodes = nodesEdges.nodes.filter((node) => targetIds.has(node.id) || sourceIds.has(node.id));
    console.log(nodes);
    console.log(nodesEdges.edges);
    return getLayoutedElements(nodes, nodesEdges.edges);
  }, [nodesEdges.edges, nodesEdges.nodes]);

  return result;
};
