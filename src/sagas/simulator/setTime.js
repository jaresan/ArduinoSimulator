import { put, select } from 'redux-saga/effects';
import { r_moveToTime, r_setSimulatorTime } from 'actions/simulatorActions';
import { r_setRobotState } from 'actions/robotActions';
import { getHistory } from 'selectors/simulatorSelectors';
import { getRobot } from 'selectors';

export default function* setTime({ payload: { time } }) {
  const history = yield select(getHistory);
  const index = history.findLastKey((value, index) => index <= time);
  const seekState = history.get(index);

  yield put(r_setSimulatorTime(time));
  yield put(r_setRobotState(seekState));
}