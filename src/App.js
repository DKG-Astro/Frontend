import React, { useEffect } from 'react';
import Routes from './pages/route/Routes';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchMasters } from './store/slice/masterSlice';


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMasters());
  }, [dispatch])

  return (
    <Routes />
  );
}

export default App;
