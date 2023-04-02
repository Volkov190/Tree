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

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedItem } = useItems();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchItemsThunk());
  }, [dispatch]);

  return (
    <div className="d-flex h-100 w-100">
      <div className="flex-grow-1 d-flex flex-column h-100">
        <StyledTopDrawer isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
        <TreesWrapper className="flex-grow-1 mt-5">
          <div className="d-flex flex-column align-items-center">
            <Trees />
          </div>
        </TreesWrapper>
      </div>
      {selectedItem && <Sidebar />}
    </div>
  );
}

const TreesWrapper = styled.div``;

const StyledTopDrawer = styled(TopDrawer)<{ isOpen: boolean }>`
  height: ${({ isOpen }) => (isOpen ? TOP_DRAWER_HEIGHT : 0)}px;
  transition: height ${DEFAULT_TRANSITION}s;
`;

export default App;
