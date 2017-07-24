import { fork } from 'redux-saga/effects';
import loadImage from './loadImage';

export default function* root() {
  yield [
    fork(loadImage)
  ]
}