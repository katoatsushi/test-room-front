import React from 'react';
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
const enhancer = process.env.NODE_ENV === 'development' ? composeWithDevTools(applyMiddleware(thunk)) : applyMiddleware(thunk)

switch (process.env.NODE_ENV) {
  case 'development':
    axios.defaults.baseURL = 'http://localhost:3000';
    break;
  case 'production':
    // EC2のグローバルIPアドレス
    axios.defaults.baseURL = 'https://3.142.183.228';
    break;
  default:
    axios.defaults.baseURL = 'http://localhost:3000';
}

ReactDOM.render(
  <>
    <Provider store={store}>
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
    </Provider>
  </>,
  document.getElementById('root')
);
// registerServiceWorker();
