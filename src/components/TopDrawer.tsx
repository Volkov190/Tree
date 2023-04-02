import { FC, memo, useMemo, useState } from 'react';
import useItems from '../hooks/useItems';
import { isCluster, isGroup, isImportantItem, isProduct, Kind } from '../types/item';
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

  const importantItems = useMemo(() => itemsWithoutRelations.filter(isImportantItem), [itemsWithoutRelations]);

  return (
    <div className={className}>
      <StyledMenu showMenu={isOpen}>
        <StyledHeaderMenu>
          <StyledTabs>
            <StyledTab
              onClick={() => setCurrentTab(Kind.CLUSTER)}
              hasError={!!importantItems.filter(isCluster).length}
              isSelected={currentTab === Kind.CLUSTER}
            >
              Кластеры
            </StyledTab>
            <StyledTab
              onClick={() => setCurrentTab(Kind.GROUP)}
              hasError={!!importantItems.filter(isGroup).length}
              isSelected={currentTab === Kind.GROUP}
            >
              Группы
            </StyledTab>
            <StyledTab
              onClick={() => setCurrentTab(Kind.ITEM)}
              hasError={!!importantItems.filter(isProduct).length}
              isSelected={currentTab === Kind.ITEM}
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

const StyledTab = styled.div<{ hasError?: boolean; isSelected?: boolean }>`
  padding: 10px;
  cursor: pointer;
  user-select: none;

  border-bottom-style: solid;
  border-bottom-color: ${({ hasError }) => (hasError ? 'red' : 'black')};
  border-bottom-width: ${({ isSelected }) => (isSelected ? '2px' : '0')};

  & {
    color: ${({ hasError }) => (hasError ? 'red' : undefined)};
  }
`;

const StyledTabs = styled.div`
  display: flex;
`;

const StyledButton = styled.button<{ existsImportantItems: boolean }>`
  color: white;

  position: absolute;
  bottom: 0;
  left: 50%;
  padding: 7px;

  border-radius: 0 0 10px 10px;
  background-color: ${({ existsImportantItems }) => (existsImportantItems ? 'red' : 'gray')};

  border: 1px solid rgba(0, 0, 0, 0.12);
  border-top: none;

  cursor: pointer;

  transform: translateX(-50%) translateY(30px);
  transition: ${DEFAULT_TRANSITION}s;
  z-index: 10;

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
  // @MAYBE_TODO: высоты шалят, тут должно считаться само
  height: ${TOP_DRAWER_HEIGHT - 44 - 32}px;
  overflow-y: auto;
`;

export default memo(TopDrawer);
