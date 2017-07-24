import { fork } from 'redux-saga/effects';
import simulatorSaga from './simulator';

// function* callSomething(action) {
//   const result = yield call(root, action.param);
//   yield put({ type: '', result });
// }


export default function* root() {
  yield [
    fork(simulatorSaga)
  ];
}
