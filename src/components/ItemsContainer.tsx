import { FC } from 'react';
import FakeNode from './FakeNode';
import { Kind } from '../types/item';
import styled from 'styled-components';
import useItems from '../hooks/useItems';

interface TopDrawerItemsContainerProps {
  kind: Kind;
}

const ItemsContainer: FC<TopDrawerItemsContainerProps> = ({ kind }) => {
  const { itemsWithoutRelations } = useItems();

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

const StyledItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  overflow: auto;
  padding: 15px;
  box-sizing: border-box;
`;
