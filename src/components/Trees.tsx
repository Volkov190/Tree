import { FC, memo } from 'react';
import { ReactFlowProvider } from 'reactflow';
import useTrees from '../hooks/useTrees';
import Tree from './Tree';

const Trees: FC = () => {
  const { fullTrees, treesWithoutProducts, treesWithoutClusters } = useTrees();

  return (
    <>
      {[...fullTrees, ...treesWithoutProducts, ...treesWithoutClusters].map((tree, idx) => (
        <ReactFlowProvider key={idx}>
          <Tree tree={tree} className="mb-4" />
        </ReactFlowProvider>
      ))}
    </>
  );
};

export default memo(Trees);
