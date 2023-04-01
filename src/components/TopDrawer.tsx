import * as React from 'react';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { Box, styled, Tab, Tabs, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FakeNode from './FakeNode';
import useItems from '../hooks/useItems';
import { Kind } from '../types/item';

const TopDrawer = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [value, setValue] = useState(0);
  const { itemsWithoutRelations } = useItems();

  return (
    <StyledMenu showMenu={showMenu}>
      <StyledHeaderMenu>
        <Tabs value={value} onChange={(_e, newValue) => setValue(newValue)}>
          <Tab label="Clusters" />
          <Tab label="Groups" />
          <Tab label="Products" />
        </Tabs>
        <IconButton onClick={() => setShowMenu(false)} sx={{ marginRight: '5px', width: 48 }}>
          <CloseIcon />
        </IconButton>
      </StyledHeaderMenu>
      <Box borderBottom={'1px solid rgba(0, 0, 0, 0.12)'} width={'100%'}>
        {value === 0 && (
          <StyledItemsContainer>
            {itemsWithoutRelations
              .filter((item) => item.kind === Kind.CLUSTER)
              .map((item, index) => {
                return <FakeNode key={index} item={item} />;
              })}
          </StyledItemsContainer>
        )}
        {value === 1 && (
          <StyledItemsContainer>
            {itemsWithoutRelations
              .filter((item) => item.kind === Kind.GROUP)
              .map((item, index) => {
                return <FakeNode key={index} item={item} />;
              })}
          </StyledItemsContainer>
        )}
        {value === 2 && (
          <StyledItemsContainer>
            {itemsWithoutRelations
              .filter((item) => item.kind === Kind.ITEM)
              .map((item, index) => {
                return <FakeNode key={index} item={item} />;
              })}
          </StyledItemsContainer>
        )}
      </Box>
      <StyledButton onClick={() => setShowMenu((prev) => !prev)} disabled={!itemsWithoutRelations.length}>
        Не используемые элементы ({itemsWithoutRelations.length})
      </StyledButton>
    </StyledMenu>
  );
};

export default TopDrawer;

const StyledButton = styled(Button)`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) translateY(36px);
  z-index: 10;
  border-radius: 0 0 10px 10px;
  background-color: gray;
  color: white;
  &:hover {
    background-color: darkgray;
  }
  &.Mui-disabled {
    color: white;
    background-color: lightgray;
  }
`;

const StyledItemsContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  overflow: auto;
  padding: 20px;
`;

const StyledMenu = styled(Box)<{ showMenu: boolean }>`
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 10;
  background: #f5f5f5;
  transition: 0.5s;
  left: 0;
  transform: translateY(${({ showMenu }) => (!showMenu ? '-100%' : 0)});
`;

const StyledHeaderMenu = styled(Box)`
  border: 1px solid rgba(0, 0, 0, 0.12);
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
