import { useMemo } from 'react';
import { Box, styled } from '@mui/material';
import { Item, Kind } from '../types/item';
import useItems from '../hooks/useItems';

interface FakeNodeProps {
  item: Item;
}

const FakeNode = ({ item }: FakeNodeProps) => {
  const { onSelectItem } = useItems();

  const borderColor = useMemo(() => {
    if (item.kind === Kind.ITEM) {
      return '#000';
    } else if (item.kind === Kind.GROUP) {
      return '#00f';
    } else return '#FF00FF';
  }, [item.kind]);

  return (
    <StyledBox
      onClick={() => onSelectItem(item)}
      borderColor={borderColor}
      color={item.important ? 'red' : undefined}
      title={item.important ? 'Элемент является значимым' : undefined}
    >
      {item.name}
    </StyledBox>
  );
};

const StyledBox = styled(Box)<{ borderColor: string }>`
  padding: 10px;
  border: 1px solid ${({ borderColor }) => borderColor};
  border-radius: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 147px;
  cursor: pointer;
  height: min-content;
  user-select: none;
`;

export default FakeNode;
