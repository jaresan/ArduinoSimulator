import { take, fork, cancel, takeEvery } from 'redux-saga/effects';
import { runSimulator } from './runSimulator';
import { resetSimulator } from './resetSimulator';
import { s_runSimulator, s_pauseSimulator, s_stopSimulator } from 'actions/simulatorActions';

import { getWorld, getRobot } from 'selectors';
import { getRobotFunctions } from 'selectors/codeEditorSelectors';

function* simulatorHandler() {
  const task = yield fork(runSimulator);
  yield take([s_pauseSimulator.type, s_stopSimulator.type]);
  yield cancel(task);
}

export default function* simulatorSaga() {
  yield takeEvery(s_stopSimulator.type, resetSimulator);
  yield takeEvery(s_runSimulator.type, simulatorHandler);
}