import React, { useEffect } from 'react';
import Routes from './pages/route/Routes';
import axios from 'axios';
import { useDispatch } from 'react-redux';

axios.defaults.baseURL="http://103.181.158.220:8081/astro-service"

function App() {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(getOngoingSmsDutyDtls());
  //   dispatch(getOngoingRollingDutyDtls());
  // }, [dispatch])

  return (
    <Routes />
  );
}

export default App;
