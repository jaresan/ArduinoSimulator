import { createAction } from './utils';

export const r_setImageData = createAction(({width, height, pixels}) => ({width, height, pixels}), 'r_World.setImageData');