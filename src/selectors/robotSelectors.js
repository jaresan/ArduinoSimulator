import { createSelector } from 'reselect';
import { getRobot } from 'selectors';
import { getSpeedCoeffs } from 'reducers/robotReducer';

/** Returns current relative speed of the robot eg. {left: 0.5, right: 1}*/
export const getSpeed = createSelector(
  getRobot,
  robot => getSpeedCoeffs(robot)
);

/** Returns true if the robot is still, otherwise false */
export const getStopped = createSelector(
  getRobot,
  robot => robot.get('leftWheel') === robot.get('rightWheel') && robot.get('rightWheel') === robot.get('servoStop')
);

export const getSensorReadings = createSelector(
  getRobot,
  robot => robot.get('sensors')
);