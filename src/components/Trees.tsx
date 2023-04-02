import { FC, memo, useCallback } from 'react';
import { ReactFlowProvider } from 'reactflow';
import useItems from '../hooks/useItems';
import Tree from './Tree';

import Button from './Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/store';
import { undoLastChange } from '../slices/items';
const Trees: FC = () => {
  const { trees } = useItems();

  const dispatch = useDispatch<AppDispatch>();

  const undoChanges = useCallback(() => {
    dispatch(undoLastChange());
  }, [dispatch]);

  return (
    <>
      <Button onClick={() => undoChanges()}>Undo</Button>
      {trees.map((tree, idx) => (
        <ReactFlowProvider key={idx}>
          <Tree tree={tree} className="mb-4" />
        </ReactFlowProvider>
      ))}
    </>
  );
};

export default memo(Trees);
