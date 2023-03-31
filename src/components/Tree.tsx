import * as d3 from 'd3-hierarchy';
import { FC, memo, useCallback } from 'react';
import ReactFlow, {
  Connection,
  ConnectionLineType,
  Edge,
  Node,
  Position,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { initialEdges, initialNodes } from '../assets/nodes-edges';

import '../index.css';
import { Item } from '../types/item';

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: Node<Item>[], edges: Edge[]) => {
  const map = new Map<string, string[]>();

  initialNodes.forEach((node) => map.set(node.id, []));
  initialEdges.forEach((edge) => {
    const newArray = map.get(edge.target) || [];
    newArray.push(edge.source);
    map.set(edge.target, newArray);
  });
  const root = d3
    .stratify()
    .id((d) => (d as Node<Item>).id)
    .parentId((d) => map.get((d as Node<Item>).id) as any)(initialNodes);
  const tree = d3.tree().nodeSize([nodeHeight * 2.5, nodeWidth * 1.5])(root);
  const newNodes: Node<Item>[] = [];
  tree.each((node1) => {
    const node = node1 as d3.HierarchyPointNode<Node<Item>>;
    node.data.targetPosition = Position.Left;
    node.data.sourcePosition = Position.Right;
    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    console.log(node.x, node.y);
    node.data.position = {
      x: node.y,
      y: node.x,
    };
    newNodes.push(node.data);
  });
  return { nodes: newNodes, edges };
};
const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);

const Tree: FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Item>(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className="layoutflow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      />
    </div>
  );
};

export default memo(Tree);
