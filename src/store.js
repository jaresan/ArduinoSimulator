import { createStore, applyMiddleware } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';

import createSagaMiddleware from 'redux-saga';
import mySaga from './sagas/sagas';

import rootReducer, { initialStates } from './reducers/index';

const defaultState = {
  robot: initialStates.robot,
  routing: {},
  simulator: initialStates.simulator,
  world: initialStates.world
};

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, defaultState, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(mySaga);

export const history = syncHistoryWithStore(browserHistory, store);

export default store;

