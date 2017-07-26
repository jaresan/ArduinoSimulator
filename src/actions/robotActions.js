import { createAction } from './utils';

export const r_tick = createAction((field, behavior) => ({field, behavior}), 'r_Robot.tick');