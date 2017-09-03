import { fromJS, OrderedMap } from 'immutable';
import { roundWithPrecision } from 'utils';
import { r_saveRobotHistoryEntry, r_clearHistory, r_setSimulatorTime } from 'actions/simulatorActions';

const initialState = fromJS({
  history: OrderedMap()
});

export default (state = initialState, action) => {
  const {
    type,
    payload
  } = action;

  switch (type) {
    case r_saveRobotHistoryEntry.type: {
      const { time, robot } = payload;
      return state.update('history', h => h.set(roundWithPrecision(time, 3), robot));
    }

    case r_clearHistory.type: {
      return state.set('history', OrderedMap());
    }

    case r_setSimulatorTime.type: {
      return state.set('currentTime', payload.time);
    }

    default:
      return state;
  }
};