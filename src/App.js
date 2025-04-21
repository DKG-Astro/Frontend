import React, { useEffect } from 'react';
import Routes from './pages/route/Routes';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchMasters } from './store/slice/masterSlice';

<<<<<<< HEAD
axios.defaults.baseURL="http://103.181.158.220:8081/astro-service"
// axios.defaults.baseURL="http://localhost:8081/astro-service"
=======
//axios.defaults.baseURL="http://103.181.158.220:8081/astro-service"
axios.defaults.baseURL="http://localhost:8081/astro-service"
>>>>>>> b30cfd9aa6f2ca1f64e2f985c91d9da1d1febdda

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
