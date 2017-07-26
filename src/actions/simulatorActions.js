import { createAction } from './utils';

export const s_loadImage = createAction(({img, targetWidth, realWorldWidth, realWorldHeight}) => ({img, targetWidth, realWorldWidth, realWorldHeight}), 's_Simulator.loadImage');
export const s_runSimulator = createAction(() => {}, 's_Simulator.runSimulator');