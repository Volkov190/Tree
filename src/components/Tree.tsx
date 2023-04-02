import { FC, memo, useState, useEffect, useMemo } from 'react';
import ReactFlow, {
  Connection,
  ConnectionLineType,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow';
import styled from 'styled-components';
import { NODE_HEIGHT, NODE_SCALE, NODE_STEP_HEIGHT, NODE_STEP_WIDTH, NODE_WIDTH } from '../const/tree';
import useItems from '../hooks/useItems';

import { useLayout } from '../hooks/useLayout';
import '../index.css';
import { Item, Kind } from '../types/item';

interface TreeProps {
  tree: Item[];
  className?: string;
}

const Tree: FC<TreeProps> = ({ tree, className }) => {
  const layout = useLayout(tree);
  const { onSelectItem } = useItems();
  const flow = useReactFlow();

  const [nodes, setNodes] = useNodesState<Item>([]);
  const [edges, setEdges] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNodes(layout.nodes);
  }, [layout.nodes, setNodes]);

  useEffect(() => {
    setEdges(layout.edges);
  }, [layout.edges, setEdges]);

  // @NOTE: костыль ;(
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      flow.fitView({ padding: 0 });
      setIsLoading(false);
    }, 500);
  }, [flow, tree]);

  const itemCount = useMemo(() => tree.filter((item) => item.kind === Kind.ITEM).length, [tree]);

  return (
    <div className={`d-inline-block ${className || ''}`}>
      <ReactFlowWrapper itemCount={itemCount}>
        <ReactFlow
          onLoad={(node) => console.log(node)}
          nodes={nodes}
          edges={edges}
          onNodeClick={(_value, { data: nodeData }) => onSelectItem(nodeData)}
          fitView
          fitViewOptions={{ padding: 0 }}
          nodesConnectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          nodesDraggable={false}
          zoomOnDoubleClick={false}
        />
        {isLoading && <Loader />}
      </ReactFlowWrapper>
    </div>
  );
};

const Loader: FC = () => {
  return <LoaderWrapper>loading..</LoaderWrapper>;
};

const LoaderWrapper = styled.div`
  background: white;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const ReactFlowWrapper = styled.div<{ itemCount: number }>`
  width: ${NODE_SCALE * (NODE_WIDTH * 3 + NODE_STEP_WIDTH * 2)}px;
  height: ${({ itemCount }) => NODE_SCALE * (NODE_HEIGHT * itemCount + NODE_STEP_HEIGHT * (itemCount - 1))}px;
  position: relative;
  .react-flow__panel {
    display: none;
  }

  .react-flow {
  }

  .react-flow__node {
    border-radius: 3px;
    padding: 10px;
    text-transform: capitalize;
  }
  .react-flow__node.selectable:hover {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }

  .react-flow__node-default {
    border: 1px solid blue;
  }

  .react-flow__node-input {
    border: 2px solid #ff00ff;
  }

  .react-flow__handle:hover {
    background-color: #575452;
  }
`;

export default memo(Tree);
