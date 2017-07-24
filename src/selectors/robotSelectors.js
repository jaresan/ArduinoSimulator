import { createSelector } from 'reselect';
import { getRobot } from 'selectors';

/** Returns current relative speed of the robot eg. {left: 0.5, right: 1}*/
export const getSpeed = createSelector(
  getRobot,
  robot => {
    const [
      lCoeff, rCoeff,
      lWheel, rWheel,
      sStop, spread, maxSpeed
    ] = [
      robot.get('leftServoCoeff'), robot.get('rightServoCoeff'),
      robot.get('leftWheel'), robot.get('rightWheel'),
      robot.get('servoStop'), robot.get('servoSpeedSpread'), robot.get('maxSpeed')
    ];

    return {
      left: lCoeff * ((lWheel - sStop) / spread) * maxSpeed,
      right: rCoeff * ((rWheel - sStop) / spread) * maxSpeed
    };
  }
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