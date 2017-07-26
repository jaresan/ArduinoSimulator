import { select, call, put, take, fork, cancel, takeEvery } from 'redux-saga/effects';
import { delay } from 'redux-saga'
import { s_runSimulator, s_pauseSimulator, s_stopSimulator } from 'actions/simulatorActions';
import { r_tick, r_resetRobot } from 'actions/robotActions';

import { getWorld, getRobot } from 'selectors';
import { getRobotFunction } from 'selectors/codeEditorSelectors';


function* runSimulator() {
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
  yield takeEvery(s_stopSimulator.type, function*() { yield put(r_resetRobot())});

  while (true) {
    yield take(s_runSimulator.type);
    const task = yield fork(runSimulator);
    const { type } = yield take([s_pauseSimulator.type, s_stopSimulator.type]);
    yield cancel(task);
    if (type === s_stopSimulator.type) {
      yield put(r_resetRobot());
    }
  }
}