import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import Simulator from 'components/Simulator/Simulator';
import store from './store';


const app = (
  <Provider store={store}>
    <div>
      {/*<Routes />*/}
      <Simulator
        width={1000}
      />
    </div>
  </Provider>
);

ReactDOM.render(
  app,
  document.getElementById('root'),
);
