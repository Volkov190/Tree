import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import data from './assets/x5.json';

import ReactFlow, {
  Connection,
  Edge,
  ReactFlowInstance,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Items, Kind } from './types/item';

interface CustomNode extends Node {}
const test: Node;

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'item' },
    position: { x: 500, y: 5 },
  },
  {
    id: '2',
    type: 'input',
    data: { label: 'item2' },
    position: { x: 700, y: 5 },
  },
  {
    id: '3',
    type: 'default',
    data: { label: 'group1' },
    position: { x: 600, y: 100 },
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'cluster1' },
    position: { x: 600, y: 200 },
  },
];

function App() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const items = (data as Items).filter((item) => item.kind === Kind.ITEM)
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<any, Edge>>();
  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  return (
    <div className="container">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            // onDrop={onDrop}
            // onDragOver={onDragOver}
            fitView
          >
            {/* <Controls /> */}
          </ReactFlow>
        </div>
        {/* <Sidebar /> */}
      </ReactFlowProvider>
    </div>
  );
}

export default App;
