import { put } from 'redux-saga/effects';
import { r_resetRobot } from 'actions/robotActions';
import { r_clearHistory } from 'actions/simulatorActions';

export default function* resetSimulator() {
  yield put(r_resetRobot());
  yield put(r_clearHistory());
}