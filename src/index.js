import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import Routes from './routes';
import Simulator from 'components/Simulator';
import store from './store';


const app = (
  <Provider store={store}>
    <div>
      <Routes />
      <Simulator/>
    </div>
  </Provider>
);

console.log(app);
ReactDOM.render(
  app,
  document.getElementById('root'),
);
