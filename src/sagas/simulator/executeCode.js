import { select, put } from 'redux-saga/effects';
import { r_saveRobotHistoryEntry, s_setTime } from 'actions/simulatorActions';
import { r_tick, r_setup, r_resetRobot } from 'actions/robotActions';

import { MAX_ROBOT_RUNTIME } from 'constants/simulator';
import { getWorld, getRobot } from 'selectors';
import { getRobotFunctions } from 'selectors/codeEditorSelectors';


// FIXME: Compute robot history entries on the server
export default function* executeCode() {
  yield put(r_resetRobot());

  const world = yield select(getWorld);
  let robot = yield select(getRobot);
  let { loopFunction, setupFunction } = yield select(getRobotFunctions);

  // FIXME: Catch eval errors (no setup or no loop function etc.)
  // eslint-disable-next-line
  loopFunction = eval(loopFunction);
  // eslint-disable-next-line
  setupFunction = eval(setupFunction);

  const sensorInterval = robot.get('sensorInterval');

  // FIXME: Catch setup errors
  yield put(r_setup(setupFunction));
  let i = 0;
  while (i * sensorInterval <= MAX_ROBOT_RUNTIME) {
    yield put(r_saveRobotHistoryEntry(i++ * sensorInterval, robot));
    yield put(r_tick(world.get('pixels'), loopFunction, sensorInterval));
    robot = yield select(getRobot);
  }

  yield put(s_setTime(0));
}