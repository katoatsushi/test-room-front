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
    // // httpsで通信
    // axios.defaults.baseURL = 'https://3.142.183.228';
    // httpsではなく、httpで通信
    // axios.defaults.baseURL = 'http://3.142.183.228';
    // 参考http://blackwhite.sakura.ne.jp/wp/2017/10/06/https%E3%81%A8http%E3%81%AE%E6%B7%B7%E5%90%88%E3%82%B5%E3%82%A4%E3%83%88%E3%81%A7%E5%A4%96%E9%83%A8%E3%83%AA%E3%83%B3%E3%82%AF%E3%81%8C%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%82%81%E3%81%AA%E3%81%84%E5%A0%B4/
    axios.defaults.baseURL = '/3.142.183.228';
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
