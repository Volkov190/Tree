import { FC, memo, useState, useEffect, useMemo } from 'react';
import ReactFlow, { useEdgesState, useNodesState, useReactFlow } from 'reactflow';
import styled from 'styled-components';
import { NODE_HEIGHT, NODE_SCALE, NODE_STEP_HEIGHT, NODE_STEP_WIDTH, NODE_WIDTH } from '../const/tree';

import { useLayout } from '../hooks/useLayout';
import { isCluster, isGroup, isProduct, Item } from '../types/item';
import useItems from '../hooks/useItems';

interface TreeProps {
  tree: Item[];
  className?: string;
}

const Tree: FC<TreeProps> = ({ tree, className }) => {
  const isWithoutProducts = useMemo(() => !tree.some(isProduct), [tree]);
  const isWithoutCluster = useMemo(() => !tree.some(isCluster), [tree]);

  const layout = useLayout(tree, { isWithoutProducts, isWithoutCluster });
  const { onSelectItem } = useItems();
  const flow = useReactFlow();

  const [nodes, setNodes] = useNodesState<Item>([]);
  const [edges, setEdges] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(false);

  const additionalCount = useMemo(() => {
    const productsPerGroup = tree.filter(isGroup).map((group) => {
      return tree.filter(isProduct).filter((product) => product.groupUuid === group.uuid).length;
    });

    let testNumber = 0;
    let nextIdxForCheck: number | null = null;
    productsPerGroup.forEach((curCount, curIdx) => {
      if (nextIdxForCheck !== null && curIdx < nextIdxForCheck) return;
      nextIdxForCheck = null;

      if (curCount !== 0) return;

      let prevNonZeroCount = 0;
      let nextNonZeroCount = 0;
      let aroundZeroCount = 0;
      productsPerGroup.forEach((count, idx) => {
        if (idx === curIdx) return;

        if (idx < curIdx && count !== 0) {
          prevNonZeroCount = count;
          aroundZeroCount = 0;
        } else if (idx > curIdx && !nextNonZeroCount && count !== 0) {
          nextNonZeroCount = count;
          nextIdxForCheck = idx;
        } else if (prevNonZeroCount && !nextNonZeroCount && count === 0) {
          aroundZeroCount += 1;
        }
      });

      const res =
        aroundZeroCount +
        1 -
        ((prevNonZeroCount > 0 ? prevNonZeroCount - 1 : 0) + (nextNonZeroCount > 0 ? nextNonZeroCount - 1 : 0)) / 2;
      if ((prevNonZeroCount || nextNonZeroCount) && res > 0) {
        testNumber += res;
      }
    });

    return testNumber;
  }, [tree]);

  const itemCount = useMemo(() => {
    if (isWithoutProducts) {
      return tree.filter(isGroup).length;
    } else {
      return tree.filter(isProduct).length;
    }
  }, [isWithoutProducts, tree]);

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

  return (
    <div className={`d-inline-block ${className || ''}`}>
      <ReactFlowWrapper itemCount={itemCount + additionalCount}>
        <ReactFlow
          className="nowheel"
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
          preventScrolling
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
  height: ${({ itemCount }) => NODE_SCALE * (NODE_HEIGHT * itemCount + NODE_STEP_HEIGHT * (itemCount - 1)) + 2}px;
  position: relative;
  .react-flow__panel {
    display: none;
  }

  .react-flow__node {
    border-radius: 3px;
    padding: 10px;
    text-transform: capitalize;
    display: flex;
    align-items: center;
    justify-content: center;
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
