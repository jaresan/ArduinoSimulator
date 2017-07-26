import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import worldReducer, { initialState as worldInitialState } from './worldReducer';
import simulatorReducer, { initialState as simulatorInitialState } from './simulatorReducer';
import robotReducer, { initialState as robotInitialState } from './robotReducer';
import codeEditorReducer, { initialState as codeEditorInitialState } from './codeEditorReducer';

const rootReducer = combineReducers({
  routing: routerReducer,
  robot: robotReducer,
  simulator: simulatorReducer,
  codeEditor: codeEditorReducer,
  world: worldReducer
});

export const initialStates = {
  robot: robotInitialState,
  world: worldInitialState,
  simulator: simulatorInitialState,
  codeEditor: codeEditorInitialState
};

export default rootReducer;
