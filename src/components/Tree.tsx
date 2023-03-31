import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import React, { useCallback, FC, memo } from 'react';
import ReactFlow, {
  addEdge,
  ConnectionLineType,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import * as d3 from 'd3-hierarchy';

import { initialNodes, initialEdges } from '../assets/nodes-edges.js';

import '../index.css';

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  const map = initialNodes.reduce((prev, node) => {
    return { ...prev, [node.id]: [] };
  }, {});
  initialEdges.forEach((edge) => {
    map[edge.target].push(edge.source);
  });
  const root = d3
      .stratify()
      .id((d) => d.id)
      .parentId((d) => map[d.id])(initialNodes);
  const tree = d3
      .tree()
      .nodeSize(
          isHorizontal
              ? [nodeHeight * 2.5, nodeWidth * 1.5]
              : [nodeWidth, nodeHeight * 2.5]
      )(root);
  const newNodes = [];
  tree.each((node) => {
    node.data.targetPosition = isHorizontal ? 'left' : 'top';
    node.data.sourcePosition = isHorizontal ? 'right' : 'bottom';
    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    console.log(node.x, node.y);
    node.data.position = isHorizontal
        ? {
          x: node.y,
          y: node.x
        }
        : {
          x: node.x,
          y: node.y
        };
    newNodes.push(node.data);
  });
  return { nodes: newNodes, edges };
};

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges
);

const Tree: FC = () => {
  const { value: items } = useSelector((state: RootState) => state.items);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback(
      (params) =>
          setEdges((eds) =>
              addEdge(
                  { ...params, type: ConnectionLineType.SmoothStep, animated: true },
                  eds
              )
          ),
      []
  );
  const onLayout = useCallback(
      (direction) => {
        const {
          nodes: layoutedNodes,
          edges: layoutedEdges
        } = getLayoutedElements(nodes, edges, direction);

        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
      },
      [nodes, edges]
  );

  return <div className='layoutflow'>
    <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
    />
    <div className='controls'>
      <button onClick={() => onLayout('TB')}>vertical layout</button>
      <button onClick={() => onLayout('LR')}>horizontal layout</button>
    </div>
  </div>;
};

export default memo(Tree);
