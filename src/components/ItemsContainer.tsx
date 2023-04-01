import { FC } from 'react';
import { Box, styled } from '@mui/material';
import FakeNode from './FakeNode';
import { Item, Kind } from '../types/item';

interface TopDrawerItemsContainerProps {
  itemsWithoutRelations: Item[];
  kind: Kind;
}

const ItemsContainer: FC<TopDrawerItemsContainerProps> = ({ itemsWithoutRelations, kind }) => {
  return (
    <StyledItemsContainer>
      {itemsWithoutRelations
        .filter((item) => item.kind === kind)
        .map((item, index) => {
          return <FakeNode key={index} item={item} />;
        })}
    </StyledItemsContainer>
  );
};

export default ItemsContainer;

const StyledItemsContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  overflow: auto;
  padding: 20px;
  box-sizing: border-box;
`;
