import { FC, memo } from 'react';
import { ReactFlowProvider } from 'reactflow';
import useItems from '../hooks/useItems';
import Tree from './Tree';

const Trees: FC = () => {
  const { trees } = useItems();

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
