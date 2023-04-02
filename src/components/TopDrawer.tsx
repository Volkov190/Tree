import Button from '@mui/material/Button';
import { FC, useMemo, useState } from 'react';
import { Box, IconButton, styled, Tab, Tabs } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useItems from '../hooks/useItems';
import { Item, Kind } from '../types/item';
import ItemsContainer from './ItemsContainer';

enum TabValue {
  Products = 0,
  Groups = 1,
  Clusters = 2,
}

export const TOP_DRAWER_HEIGHT = 245;

interface TopDrawerProps {
  isOpen: boolean;
  setIsOpen: (newValue: boolean) => void;
  className?: string;
}

const TopDrawer: FC<TopDrawerProps> = ({ isOpen, setIsOpen, className }) => {
  const [currentTab, setCurrentTab] = useState(TabValue.Products);
  const { itemsWithoutRelations } = useItems();

  const importantItems = useMemo(() => itemsWithoutRelations.filter((item) => item.important), [itemsWithoutRelations]);

  return (
    <div className={className}>
      <StyledMenu showMenu={isOpen}>
        <StyledHeaderMenu>
          <Tabs value={currentTab} onChange={(_e, newValue) => setCurrentTab(newValue)}>
            <StyledTab label="Кластеры" importantItems={importantItems} kind={Kind.CLUSTER} />
            <StyledTab label="Группы" importantItems={importantItems} kind={Kind.GROUP} />
            <StyledTab label="Продукты" importantItems={importantItems} kind={Kind.ITEM} />
          </Tabs>
          <IconButton onClick={() => setIsOpen(false)} sx={{ marginRight: '5px', width: 48 }}>
            <CloseIcon />
          </IconButton>
        </StyledHeaderMenu>
        <Box width={'100%'}>
          {currentTab === TabValue.Products && (
            <ItemsContainer itemsWithoutRelations={itemsWithoutRelations} kind={Kind.CLUSTER} />
          )}
          {currentTab === TabValue.Groups && (
            <ItemsContainer itemsWithoutRelations={itemsWithoutRelations} kind={Kind.GROUP} />
          )}
          {currentTab === TabValue.Clusters && (
            <ItemsContainer itemsWithoutRelations={itemsWithoutRelations} kind={Kind.ITEM} />
          )}
        </Box>
        <StyledButton
          onClick={() => setIsOpen(!isOpen)}
          disabled={!itemsWithoutRelations.length}
          existsImportantItems={!!importantItems.length}
        >
          Не используемые элементы ({itemsWithoutRelations.length})
        </StyledButton>
      </StyledMenu>
    </div>
  );
};

export default TopDrawer;

const StyledTab = styled(Tab)<{ importantItems: Item[]; kind: Kind }>`
  &.Mui-selected,
  & {
    color: ${({ importantItems, kind }) => (importantItems[0]?.kind === kind ? 'red' : undefined)};
  }
`;

const StyledButton = styled(Button)<{ existsImportantItems: boolean }>`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) translateY(36px);
  z-index: 10;
  border-radius: 0 0 10px 10px;
  background-color: ${({ existsImportantItems }) => (existsImportantItems ? 'red' : 'gray')};
  color: white;

  &:hover {
    background-color: darkgray;
  }

  &.Mui-disabled {
    color: white;
    background-color: lightgray;
  }
`;

const StyledMenu = styled(Box)<{ showMenu: boolean }>`
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  transition: 0.2s;
  height: ${TOP_DRAWER_HEIGHT}px;
  transform: translateY(${({ showMenu }) => (!showMenu ? '-100%' : 0)});
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
`;

const StyledHeaderMenu = styled(Box)`
  border: 1px solid rgba(0, 0, 0, 0.12);
  display: flex;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
`;
