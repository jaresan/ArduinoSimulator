import { createAction } from './utils';

export const r_tick = createAction((field, behavior, duration) => ({field, behavior, duration}), 'r_Robot.tick');