import { fork } from 'redux-saga/effects';
import loadImage from './loadImage';
import runSimulator from './runSimulator';

export default function* root() {
  yield [
    fork(loadImage),
    fork(runSimulator)
  ]
}