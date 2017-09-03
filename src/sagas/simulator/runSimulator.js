import { select, put, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { s_setTime } from 'actions/simulatorActions';
import { r_setRobotState } from 'actions/robotActions';

import { getRobot } from 'selectors';
import { getHistory, getSimulatorTime } from 'selectors/simulatorSelectors';

export default function* runSimulator() {
  const history = yield select(getHistory);
  const robot = yield select(getRobot);

  const historyTimes = history.keySeq().toArray();
  const sensorInterval = robot.get('sensorInterval');

  const currentTime = yield select(getSimulatorTime);
  const currentTimeIndex = historyTimes.indexOf(currentTime) || 0;
  for (let i = currentTimeIndex; i < historyTimes.length; i++) {
    yield call(delay, sensorInterval * 1000);
    yield put(s_setTime(historyTimes[i]));
  }
}