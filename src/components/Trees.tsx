import { FC, memo, useCallback } from 'react';
import { ReactFlowProvider } from 'reactflow';
import useItems from '../hooks/useItems';
import Tree from './Tree';

const Trees: FC = () => {
  const { trees, onDeleteUnimportantItems } = useItems();

  return (
    <>
      {trees.map((tree, idx) => (
        <ReactFlowProvider key={idx}>
          <Tree tree={tree} className="mb-4" />
        </ReactFlowProvider>
      ))}
    </>
  );
};

export default memo(Trees);
