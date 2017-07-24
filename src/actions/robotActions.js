import { createAction } from './utils';

export const r_tick = createAction((field, duration) => ({field, duration}), 'r_Robot.tick');