import * as React from 'react';
import { Box, styled } from '@mui/material';
import { Item, Kind } from '../types/item';

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

interface FakeNodeProps {
  item: Item;
}

const FakeNode = ({ item }: FakeNodeProps) => {
  const borderColor = item.kind === Kind.ITEM ? '#000' : item.kind === Kind.GROUP ? '#00f' : '#FF00FF';
  return <StyledBox borderColor={borderColor}>{item.name}</StyledBox>;
};

export default FakeNode;
