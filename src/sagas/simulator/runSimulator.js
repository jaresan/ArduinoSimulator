import { select, takeEvery, call, put } from 'redux-saga/effects';
import { delay } from 'redux-saga'
import { s_runSimulator } from 'actions/simulatorActions';
import { r_tick } from 'actions/robotActions';

import { getWorld, getRobot } from 'selectors';
import { getRobotFunction } from 'selectors/codeEditorSelectors';


function* runSimulator() {
  // FIXME: Clear and reset simulator when pressed again
  const world = yield select(getWorld);
  const robot = yield select(getRobot);
  let robotFunction = yield select(getRobotFunction);
  robotFunction = eval(robotFunction);

  const sensorInterval = robot.get('sensorInterval');
  while (true) {
    yield call(delay, sensorInterval * 1000);
    yield put(r_tick(world.get('pixels'), robotFunction, sensorInterval));
  }
}

export default function* saga() {
  yield takeEvery(s_runSimulator.type, runSimulator);
}