import { createAction } from './utils';

export const r_tick = createAction((field) => ({field}), 'r_Robot.tick');