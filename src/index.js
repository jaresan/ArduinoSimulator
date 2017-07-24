import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import Routes from './routes';
import Simulator from 'components/Simulator/Simulator';
import store from './store';


const app = (
  <Provider store={store}>
    <div>
      {/*<Routes />*/}
      <Simulator
        width={2000}
      />
    </div>
  </Provider>
);

ReactDOM.render(
  app,
  document.getElementById('root'),
);
