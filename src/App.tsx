import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './app/store';
import { fetchItemsThunk } from './slices/items';
import Trees from './components/Trees';
import useItems from './hooks/useItems';
import Sidebar from './components/Sidebar';
import TopDrawer, { TOP_DRAWER_HEIGHT } from './components/TopDrawer';
import styled from 'styled-components';
import { DEFAULT_TRANSITION } from './const/tree';

import Button from './components/Button';
import { BackIcon, DeleteOutline, SaveOutline, HelpOutline } from './assets/icons';
import { isImportantItem } from './types/item';
import HelpModal from './components/HelpModal';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    selectedItem,
    onDeleteUnimportantItems,
    onUndoLastChange,
    hasHistory,
    hasUnimportantItems,
    itemsWithoutRelations,
  } = useItems();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchItemsThunk());
  }, [dispatch]);
  console.log(isModalOpen);

  return (
    <div className="d-flex h-100 w-100">
      <div className="flex-grow-1 d-flex flex-column h-100">
        <StyledTopDrawer isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />

        <TreesWrapper className="flex-grow-1">
          <ControlsWrapper>
            <Button
              className="m-2"
              tooltipText="Отменить последнее изменение"
              onClick={onUndoLastChange}
              isIconButton
              disabled={!hasHistory}
            >
              <BackIcon />
            </Button>
            <Button
              className="m-2"
              tooltipText="Удалить все незначащие узлы"
              onClick={onDeleteUnimportantItems}
              isIconButton
              disabled={!hasUnimportantItems}
            >
              <DeleteOutline />
            </Button>
            <Button
              className="m-2"
              tooltipText="Сохранить"
              onClick={() => null}
              isIconButton
              disabled={!hasHistory || !!itemsWithoutRelations.filter(isImportantItem).length}
            >
              <SaveOutline />
            </Button>
            <Button className="m-2" tooltipText="FAQ" onClick={() => setIsModalOpen(true)} isIconButton>
              <HelpOutline />
            </Button>
          </ControlsWrapper>
          <ScrollWrapper className="d-flex flex-column align-items-center py-3">
            <Trees />
          </ScrollWrapper>
        </TreesWrapper>
      </div>
      {selectedItem && <Sidebar />}
      {isModalOpen && <HelpModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

const ControlsWrapper = styled.div`
  z-index: 2;
  position: absolute;
  top: 0;
  left: 0;
`;

const TreesWrapper = styled.div`
  position: relative;
`;

const StyledTopDrawer = styled(TopDrawer)<{ isOpen: boolean }>`
  height: ${({ isOpen }) => (isOpen ? TOP_DRAWER_HEIGHT : 0)}px;
  transition: height ${DEFAULT_TRANSITION}s;
  position: relative;
  z-index: 2;
`;

const ScrollWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;

  overflow-y: auto;
  box-sizing: border-box;
`;

export default App;
