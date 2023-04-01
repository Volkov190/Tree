import { useEffect } from 'react';
import './App.css';
import 'reactflow/dist/style.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './app/store';
import { fetchItemsThunk } from './slices/items';
import Tree from './components/Tree';
import useItems from './hooks/useItems';
import Sidebar from './components/Sidebar';
import TopDrawer from './components/TopDrawer';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedItem } = useItems();

  useEffect(() => {
    dispatch(fetchItemsThunk());
  }, [dispatch]);

  return (
    <div className="d-flex h-100 w-100">
      <div className="flex-grow-1">
        <TopDrawer />
        <Tree />
      </div>
      {selectedItem && <Sidebar />}
    </div>
  );
}

export default App;
