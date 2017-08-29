import { fromJS } from 'immutable';
import { r_tick, r_resetRobot, r_setup } from 'actions/robotActions';
import { ROBOT_PARAMS } from 'constants/robot';
import Robot from 'utils/robot';

export const initialState = fromJS({
  memory: {},
  ...ROBOT_PARAMS,
  sensorPositions: Robot.getSensorPositions(fromJS(ROBOT_PARAMS))
});


export default (state = initialState, action) => {
  const {
    type,
    payload
  } = action;

  switch (type) {
    case r_tick.type: {
      const {field, behavior, duration} = payload;

      state = Robot.updateSensors(state, field);
      state = Robot.applyBehavior(state, behavior);
      return Robot.moveRobot(state, duration || state.get('sensorInterval'));
    }

    case r_resetRobot.type: {
      return initialState;
    }

    case r_setup.type: {
      return Robot.setupRobot(state, payload.setupFn);
    }

    default:
      return state;
  }
};