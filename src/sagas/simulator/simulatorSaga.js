import { take, fork, cancel, takeEvery } from 'redux-saga/effects';
import runSimulator from './runSimulator';
import resetSimulator from './resetSimulator';
import setTime from './setTime';
import executeCode from './executeCode';
import stepSimulator from './stepSimulator';
import { 
  s_runSimulator,
	s_pauseSimulator,
	s_stopSimulator,
  s_stepPrevious,
  s_stepNext,
  s_seekTime,
	s_setTime,
	s_executeCode
} from 'actions/simulatorActions';

function* simulatorHandler() {
  const task = yield fork(runSimulator);

  const pauseSimulatorActions = [
    s_pauseSimulator.type,
    s_stopSimulator.type,
    s_stepNext.type,
    s_stepPrevious.type,
    s_seekTime.type,
    s_runSimulator.type
  ];

  yield take(pauseSimulatorActions);
  yield cancel(task);
}

export default function* simulatorSaga() {
  yield [
    takeEvery(s_stepNext.type, stepSimulator.bind(null, { next: 1 })),
    takeEvery(s_stepPrevious.type, stepSimulator),
    takeEvery(s_stopSimulator.type, resetSimulator),
    takeEvery(s_runSimulator.type, simulatorHandler),
    takeEvery(s_seekTime.type, setTime),
    takeEvery(s_setTime.type, setTime),
    takeEvery(s_executeCode.type, executeCode)
  ];
}