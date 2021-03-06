import { createSelector } from 'reselect';
import { getRobot } from 'selectors';

/** Returns true if the robot is still, otherwise false */
export const getStopped = createSelector(
  getRobot,
  robot => robot.get('leftWheel') === robot.get('rightWheel') && robot.get('rightWheel') === robot.get('servoStop')
);

export const getSensorReadings = createSelector(
  getRobot,
  robot => robot.get('sensors')
);

export const getInternalState = createSelector(
  getRobot,
  robot => {
    return {
      ...robot.get('memory').toJS(),
      leftWheel: robot.get('leftWheel'),
      rightWheel: robot.get('rightWheel'),
      sensors: robot.get('sensorReadings').toJS()
    }
  }
);