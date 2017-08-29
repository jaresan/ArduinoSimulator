import { createSelector } from 'reselect';
import { getSimulator, getWorld } from 'selectors';

export const getHistory = createSelector(
  getSimulator,
  simulator => simulator.get('history')
);