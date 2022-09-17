import Button from '@mui/material/Button';
import './App.css';
import {Route, Switch} from 'react-router-dom'
import Dashboard from './components/Dashboard';
import Video from './components/Video';
import { useState } from 'react';
import  axios  from 'axios';
import { useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export const config = {
  endpoint: `https://9862f2f2-fe9f-4c06-bb4e-99a0614eaca6.mock.pstmn.io`
};

function App() {
  const [videos, setVideos] = useState([]);

  const getAllVideos = async () => {
    const res = await axios.get(config.endpoint + "/v1/videos");
    setVideos(res.data.videos);
  };

  useEffect(() => {
    getAllVideos();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Switch>
      <Route path="/" exact>
        <Dashboard videos={videos} setVideos={setVideos} />
      </Route>
      <Route path="/video/:id" >
        <Video videos={videos} setVideos={setVideos} />
      </Route>
    </Switch>
    </LocalizationProvider>
  );
}

export default App;
