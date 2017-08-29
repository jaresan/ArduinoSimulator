import { select, call, put } from 'redux-saga/effects';
import { delay } from 'redux-saga'
import { r_saveRobotHistoryEntry } from 'actions/simulatorActions';
import { r_tick, r_setup } from 'actions/robotActions';

import { getWorld, getRobot } from 'selectors';
import { getRobotFunctions } from 'selectors/codeEditorSelectors';

export function* runSimulator() {
  const world = yield select(getWorld);
  let robot = yield select(getRobot);
  let { loopFunction, setupFunction } = yield select(getRobotFunctions);

  // FIXME: Catch eval errors (no setup or no loop function etc.)
  loopFunction = eval(loopFunction);
  setupFunction = eval(setupFunction);

  const sensorInterval = robot.get('sensorInterval');

  // FIXME: Catch setup errors
  yield put(r_setup(setupFunction));
  let i = 0;
  while (true) {
    yield put(r_saveRobotHistoryEntry(i++ * sensorInterval, robot));

    // Sensor interval is specified in seconds and delay takes nanoseconds -> times 1000
    yield call(delay, sensorInterval * 1000);
    yield put(r_tick(world.get('pixels'), loopFunction, sensorInterval));
    robot = yield select(getRobot);
  }
}