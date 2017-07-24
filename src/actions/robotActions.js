import { createAction } from './utils';

export const setSpeedCoeff = createAction((left, right) => ({left, right}), 'Robot.setSpeedCoeff');
export const tick = createAction(duration => ({duration}), 'Robot.tick');