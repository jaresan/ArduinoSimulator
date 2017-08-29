import { createAction } from './utils';

export const s_loadImage = createAction(({img, targetWidth, realWorldWidth, realWorldHeight}) => ({img, targetWidth, realWorldWidth, realWorldHeight}), 's_Simulator.loadImage');
export const s_runSimulator = createAction(() => {}, 's_Simulator.runSimulator');
export const s_pauseSimulator = createAction(() => {}, 's_Simulator.pauseSimulator');
export const s_stopSimulator = createAction(() => {}, 's_Simulator.stopSimulator');
export const s_seekTime = createAction(time => ({time}), 's_Simulator.seekTime');
export const r_saveRobotHistoryEntry = createAction((time, robot) => ({ time, robot }), 'r_Simulator.saveRobotHistoryEntry');