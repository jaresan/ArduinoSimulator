import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import worldReducer from './worldReducer';
import simulatorReducer from './simulatorReducer';
import robotReducer from './robotReducer';

const rootReducer = combineReducers({
  routing: routerReducer,
  robot: robotReducer,
  simulator: simulatorReducer,
  world: worldReducer
});

export default rootReducer;
