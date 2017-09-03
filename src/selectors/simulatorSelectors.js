import { createSelector } from 'reselect';
import { getSimulator } from 'selectors';

export const getHistory = createSelector(
  getSimulator,
  simulator => simulator.get('history')
);

export const getSimulatorTime = createSelector(
  getSimulator,
  simulator => simulator.get('currentTime')
);

export const getLoading = createSelector(
  getSimulator,
  simulator => simulator.get('loading')
);