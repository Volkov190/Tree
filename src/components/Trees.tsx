import { FC, memo, useCallback } from 'react';
import { ReactFlowProvider } from 'reactflow';
import useItems from '../hooks/useItems';
import Tree from './Tree';

import Button from './Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/store';
import { undoLastChange } from '../slices/items';
import { BackIcon } from '../assets/icons';

const Trees: FC = () => {
  const { trees } = useItems();

  const dispatch = useDispatch<AppDispatch>();

  const undoChanges = useCallback(() => {
    dispatch(undoLastChange());
  }, [dispatch]);

  return (
    <>
      <div className="m-2">
        <Button onClick={() => undoChanges()} isIconButton>
          <BackIcon />
        </Button>
      </div>
      {trees.map((tree, idx) => (
        <ReactFlowProvider key={idx}>
          <Tree tree={tree} className="mb-4" />
        </ReactFlowProvider>
      ))}
    </>
  );
};

export default memo(Trees);
