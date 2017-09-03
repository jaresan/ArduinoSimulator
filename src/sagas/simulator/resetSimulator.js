import { put } from 'redux-saga/effects';
import { r_resetRobot } from 'actions/robotActions';
import { s_setTime } from 'actions/simulatorActions';

export default function* resetSimulator() {
  yield put(s_setTime(0));
}