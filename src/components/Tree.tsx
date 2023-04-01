import { FC, memo, useCallback, useEffect } from 'react';
import ReactFlow, { Connection, ConnectionLineType, addEdge, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';

import { useLayout } from '../hooks/useLayout';
import '../index.css';
import { Item } from '../types/item';
import useItems from '../hooks/useItems';

const Tree: FC = () => {
  const layout = useLayout();
  const { onSelectItem } = useItems();

  const [nodes, setNodes, onNodesChange] = useNodesState<Item>([]);
  useEffect(() => {
    setNodes(layout.nodes);
  }, [layout.nodes, setNodes]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  useEffect(() => {
    setEdges(layout.edges);
  }, [layout.edges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className="layoutflow flex-grow-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        nodesDraggable={false}
        onNodeClick={(_value, { data: nodeData }) => onSelectItem(nodeData)}
      />
    </div>
  );
};

export default memo(Tree);
