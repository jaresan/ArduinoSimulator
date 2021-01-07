import { fromJS } from 'immutable';
import { r_tick, r_resetRobot, r_setup, r_setRobotState, r_setPosition } from 'actions/robotActions';
import { ROBOT_PARAMS } from 'constants/robot';
import Robot from 'utils/robot';

export let initialState = fromJS({
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

    case r_setPosition.type: {
      const {x, y, r, pixels} = payload;
      // Change initial state so subsequent resets keep the position chosen
      initialState = initialState
        .set('rotation', r)
        .set('position', fromJS({x, y}));
      initialState = Robot.updateSensors(initialState, pixels);
      const newState = state
        .set('rotation', r)
        .set('position', fromJS({x, y}));
      return Robot.updateSensors(newState, pixels);
    }

    case r_resetRobot.type: {
      return initialState;
    }

    case r_setup.type: {
      return Robot.setupRobot(state, payload.setupFn);
    }

    case r_setRobotState.type: {
      return payload.state || state;
    }

    default:
      return state;
  }
};
