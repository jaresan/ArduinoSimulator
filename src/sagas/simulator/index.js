import { fork, all } from 'redux-saga/effects';
import loadImage from './loadImage';
import simulatorSaga from './simulatorSaga';

export default function* root() {
  yield all([
    fork(loadImage),
    fork(simulatorSaga)
  ]);
}