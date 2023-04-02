import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './app/store';
import { fetchItemsThunk } from './slices/items';
import Trees from './components/Trees';
import useItems from './hooks/useItems';
import Sidebar from './components/Sidebar';
import TopDrawer, { TOP_DRAWER_HEIGHT } from './components/TopDrawer';
import styled from 'styled-components';

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
          <ScrollWrapper className="d-flex flex-column align-items-center">
            <Trees />
          </ScrollWrapper>
        </TreesWrapper>
      </div>
      {selectedItem && <Sidebar />}
    </div>
  );
}

const TreesWrapper = styled.div`
  position: relative;
`;

const StyledTopDrawer = styled(TopDrawer)<{ isOpen: boolean }>`
  height: ${({ isOpen }) => (isOpen ? TOP_DRAWER_HEIGHT : 0)}px;
  transition: height 0.2s;
`;

const ScrollWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;

  overflow-y: auto;
`;

export default App;
