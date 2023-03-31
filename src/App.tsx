import { useEffect } from 'react';
import './App.css';
import 'reactflow/dist/style.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './app/store';
import { fetchItemsThunk } from './slices/items';
import Tree from './components/Tree';

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchItemsThunk());
  }, [dispatch]);

  return (
    <div className="container">
      <Tree />
    </div>
  );
}

export default App;
