import { FC, memo, useMemo, useState } from 'react';
import useItems from '../hooks/useItems';
import { Item, Kind } from '../types/item';
import ItemsContainer from './ItemsContainer';
import styled from 'styled-components';
import { CloseIconWrapper, StyledCloseOutline } from './Sidebar';
import { DEFAULT_TRANSITION } from '../const/tree';

export const TOP_DRAWER_HEIGHT = 225;

interface TopDrawerProps {
  isOpen: boolean;
  setIsOpen: (newValue: boolean) => void;
  className?: string;
}

const TopDrawer: FC<TopDrawerProps> = ({ isOpen, setIsOpen, className }) => {
  const [currentTab, setCurrentTab] = useState(Kind.ITEM);
  const { itemsWithoutRelations } = useItems();

  const importantItems = useMemo(() => itemsWithoutRelations.filter((item) => item.important), [itemsWithoutRelations]);

  return (
    <div className={className}>
      <StyledMenu showMenu={isOpen}>
        <StyledHeaderMenu>
          <StyledTabs>
            <StyledTab
              importantItems={importantItems}
              kind={Kind.CLUSTER}
              onClick={() => setCurrentTab(Kind.CLUSTER)}
              currentTab={currentTab}
            >
              Кластеры
            </StyledTab>
            <StyledTab
              importantItems={importantItems}
              kind={Kind.GROUP}
              onClick={() => setCurrentTab(Kind.GROUP)}
              currentTab={currentTab}
            >
              Группы
            </StyledTab>
            <StyledTab
              importantItems={importantItems}
              kind={Kind.ITEM}
              onClick={() => setCurrentTab(Kind.ITEM)}
              currentTab={currentTab}
            >
              Продукты
            </StyledTab>
          </StyledTabs>
          <CloseIconWrapper>
            <StyledCloseOutline onClick={() => setIsOpen(false)} />
          </CloseIconWrapper>
        </StyledHeaderMenu>
        <div>
          <ContentWrapper className="p-3">
            {currentTab === Kind.CLUSTER && <ItemsContainer kind={Kind.CLUSTER} />}
            {currentTab === Kind.GROUP && <ItemsContainer kind={Kind.GROUP} />}
            {currentTab === Kind.ITEM && <ItemsContainer kind={Kind.ITEM} />}
          </ContentWrapper>
        </div>
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

const StyledTab = styled.div<{ importantItems: Item[]; kind: Kind; currentTab: Kind }>`
  padding: 10px;
  cursor: pointer;
  user-select: none;
  border-bottom: ${({ currentTab, kind, importantItems }) =>
    currentTab === kind
      ? `2px solid ${importantItems.filter((item) => item.kind === kind)[0]?.kind === kind ? 'red' : 'black'}`
      : undefined};
  &.Mui-selected,
  & {
    color: ${({ importantItems, kind }) =>
      importantItems.filter((item) => item.kind === kind)[0]?.kind === kind ? 'red' : undefined};
  }
`;

const StyledTabs = styled.div`
  display: flex;
`;

const StyledButton = styled.button<{ existsImportantItems: boolean }>`
  position: absolute;
  bottom: 0;
  left: 50%;
  padding: 7px;
  transform: translateX(-50%) translateY(30px);
  z-index: 10;
  border-radius: 0 0 10px 10px;
  background-color: ${({ existsImportantItems }) => (existsImportantItems ? 'red' : 'gray')};
  color: white;
  transition: ${DEFAULT_TRANSITION}s;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-top: none;
  cursor: pointer;

  &:hover {
    background-color: darkgray;
  }

  &.Mui-disabled {
    color: white;
    background-color: lightgray;
  }
`;

const StyledMenu = styled.div<{ showMenu: boolean }>`
  width: 100%;
  background: #f5f5f5;
  transition: ${DEFAULT_TRANSITION}s;
  height: ${TOP_DRAWER_HEIGHT}px;
  transform: translateY(${({ showMenu }) => (!showMenu ? '-100%' : 0)});
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
`;

const StyledHeaderMenu = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  display: flex;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
  height: ${TOP_DRAWER_HEIGHT - 44 - 32}px;
  overflow-y: auto;
`;

export default memo(TopDrawer);
