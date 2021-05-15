/* eslint-disable react/prop-types */
import React from 'react';
/* eslint-disable react/prop-types */
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import { PersistGate } from 'redux-persist/integration/react';
import { composeWithDevTools } from "redux-devtools-extension";
import Routes from './Routes';
import { createStore, applyMiddleware } from 'redux'
import Header from './components/applications/header';
import Footer from './components/applications/footer';
import { store, persistor } from './store';
import 'fontsource-roboto';
import axios from 'axios';
import { SnackbarProvider } from 'notistack';

const enhancer = process.env.NODE_ENV === 'development' ? composeWithDevTools(applyMiddleware(thunk)) : applyMiddleware(thunk)

switch (process.env.NODE_ENV) {
  case 'development':
    axios.defaults.baseURL = 'http://localhost:3000';
    break;
  case 'production':
    axios.defaults.baseURL = 'https://test-room-app.herokuapp.com/'
    break;
  default:
    axios.defaults.baseURL = 'http://localhost:3000';
}

ReactDOM.render(
  <>
    <Provider store={store}>
      <SnackbarProvider
      
          anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
          }}
      >
      <PersistGate loading={null} persistor={persistor}>
        {/* <ThemeProvider theme={theme}> */}
          <Router>
            <Header />
            <Routes />
            <div style={{margin: 100}}></div>
            <Footer />
          </Router>
        {/* </ThemeProvider> */}
      </PersistGate>
      </SnackbarProvider>
    </Provider>
  </>,
  document.getElementById('root')
);
// registerServiceWorker();