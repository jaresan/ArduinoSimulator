import { takeEvery, fork, call, put } from 'redux-saga/effects';
import { changePosition } from 'actions/robotActions';
import { changePosition as worldChangePosition } from 'actions/worldActions';

function something() {
  // call api
}

function* callSomething(action) {
  const result = yield call(something, action.param);
  yield put({ type: '', result });
}

function* a(s) {
  yield put(changePosition());
}

function* b(x) {
  console.log(x);
}

function* somethingSaga(s) {
  yield takeEvery(worldChangePosition.type, a);
  yield takeEvery(() => true, b);
}

export default function* root() {
  yield [
    fork(somethingSaga)
  ];
}
