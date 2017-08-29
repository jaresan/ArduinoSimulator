import { combineReducers } from 'redux';
import worldReducer, { initialState as worldInitialState } from './worldReducer';
import simulatorReducer, { initialState as simulatorInitialState } from './simulatorReducer';
import robotReducer, { initialState as robotInitialState } from './robotReducer';
import codeEditorReducer, { initialState as codeEditorInitialState } from './codeEditorReducer';

const rootReducer = combineReducers({
  robot: robotReducer,
  simulator: simulatorReducer,
  codeEditor: codeEditorReducer,
  world: worldReducer
});

export const initialState = {
  codeEditor: codeEditorInitialState,
  robot: robotInitialState,
  simulator: simulatorInitialState,
  world: worldInitialState
};

export default rootReducer;
