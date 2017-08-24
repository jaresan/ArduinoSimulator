import { createAction } from './utils';

export const r_tick = createAction((field, behavior, duration) => ({field, behavior, duration}), 'r_Robot.tick');
export const r_resetRobot = createAction(() => {}, 'r_Robot.resetRobot');
export const r_setup = createAction(setupFn => ({ setupFn }), 'r_Robot.setup');