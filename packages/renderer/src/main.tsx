import React from 'react';
import ReactDOM from 'react-dom';
import { CssBaseline } from '@mui/material';
import { App } from './App';
import 'virtual:windi.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';

import { SnackbarProvider } from 'notistack';
ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <SnackbarProvider maxSnack={2}>
      <App />
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
