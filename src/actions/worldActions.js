import { createAction } from './utils';

export const r_setImageData = createAction(({imageData, realWorldWidth, realWorldHeight}) => ({imageData, realWorldWidth, realWorldHeight}));