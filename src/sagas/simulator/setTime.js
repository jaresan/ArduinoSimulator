import { put, select } from 'redux-saga/effects';
import { r_setSimulatorTime } from 'actions/simulatorActions';
import { r_setRobotState } from 'actions/robotActions';
import { getHistory } from 'selectors/simulatorSelectors';
import { getRobot } from 'selectors';

export default function* setTime({ payload: { time } }) {
  const robot = yield select(getRobot);
  const sensorInterval = robot.get('sensorInterval');
  const history = yield select(getHistory);
  const timeToSet = history.findLastKey((value, historyTimeIndex) => (historyTimeIndex - time) < sensorInterval / 2);
  const seekState = history.get(timeToSet);

  yield put(r_setSimulatorTime(timeToSet));
  yield put(r_setRobotState(seekState));
}