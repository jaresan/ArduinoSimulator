import { createAction } from './actionTypes';

export const changePosition = createAction((dX, dY) => ({dX, dY}), 'Robot.changePosition');