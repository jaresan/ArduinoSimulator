import { fork } from 'redux-saga/effects';
import loadImage from './loadImage';
import simulatorSaga from './simulatorSaga';

export default function* root() {
  yield [
    fork(loadImage),
    fork(simulatorSaga)
  ];
}