import { FC, memo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

const Tree: FC = () => {
  const { value: items } = useSelector((state: RootState) => state.items);
  items;

  return null;
};

export default memo(Tree);
