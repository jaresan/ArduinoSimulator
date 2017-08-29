import { select, call, put, take, fork, cancel, takeEvery } from 'redux-saga/effects';
import { delay } from 'redux-saga'
import { s_runSimulator, s_pauseSimulator, s_stopSimulator } from 'actions/simulatorActions';
import { r_tick, r_resetRobot, r_setup } from 'actions/robotActions';

import { getWorld, getRobot } from 'selectors';
import { getRobotFunctions } from 'selectors/codeEditorSelectors';


function* runSimulator() {
  const world = yield select(getWorld);
  const robot = yield select(getRobot);
  let { loopFunction, setupFunction } = yield select(getRobotFunctions);

  // FIXME: Catch eval errors (no setup or no loop function etc.)
  loopFunction = eval(loopFunction);
  setupFunction = eval(setupFunction);

  const sensorInterval = robot.get('sensorInterval');

  // FIXME: Catch setup errors
  yield put(r_setup(setupFunction));
  while (true) {
    // Sensor interval is specified in seconds -> times 1000
    yield call(delay, sensorInterval * 1000);
    yield put(r_tick(world.get('pixels'), loopFunction, sensorInterval));
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