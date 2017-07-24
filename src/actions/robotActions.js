import { createAction } from './utils';

export const changePosition = createAction((dX, dY) => ({dX, dY}), 'Robot.changePosition');