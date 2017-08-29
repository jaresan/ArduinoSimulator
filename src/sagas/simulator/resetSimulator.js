import { put } from 'redux-saga/effects';
import { r_resetRobot } from 'actions/robotActions';

export default function* resetSimulator() {
  yield put(r_resetRobot());
}