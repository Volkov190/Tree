import { useEffect, useState } from 'react';
import './App.css';
import 'reactflow/dist/style.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './app/store';
import { fetchItemsThunk } from './slices/items';
import Tree from './components/Tree';
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
        <Tree />
      </div>
      {selectedItem && <Sidebar />}
    </div>
  );
}

const StyledTopDrawer = styled(TopDrawer)<{ isOpen: boolean }>`
  height: ${({ isOpen }) => (isOpen ? TOP_DRAWER_HEIGHT : 0)}px;
`;

export default App;
