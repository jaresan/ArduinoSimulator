import { put, select } from 'redux-saga/effects';
import { s_setTime } from 'actions/simulatorActions';
import { getRobot } from 'selectors';
import { getSimulatorTime, getHistory } from 'selectors/simulatorSelectors';


export default function* stepSimulator({ next }) {
  const robot = yield select(getRobot);
  const history = yield select(getHistory);
  const maxTime = parseFloat(history.keySeq().last());
  const sensorInterval = robot.get('sensorInterval');
  const currentTime = yield select(getSimulatorTime);

  const newTime = next ? Math.min(currentTime + sensorInterval, maxTime) : Math.max(currentTime - sensorInterval, 0);
  console.log(newTime);
  yield put(s_setTime(newTime));
}