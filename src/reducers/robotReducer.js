import { fromJS } from 'immutable';
import { setSpeedCoeff, tick } from 'actions/robotActions';
import { rotatePoint, roundWithPrecision } from 'utils';
import { canSeeLine } from './worldReducer';

import { POSITION_PRECISION, ROBOT_PARAMS } from 'constants/robot'

const initialState = fromJS({
  sensors: []
}).merge(ROBOT_PARAMS);


function getSensorPosition(robot, deltaX, deltaY) {
  const [x, y] = [robot.getIn(['position', 'x']), robot.getIn(['position', 'y'])];
  return rotatePoint(x, y, x + deltaX, y + deltaY, robot.get('rotation'));
}

function readSensors(robot, field) {
  return robot.get('sensorDeltas').map(([deltaX, deltaY]) => {
    const [x, y] = getSensorPosition(robot, deltaX, deltaY);
    return canSeeLine({x, y, field, sensorRadius: robot.get('sensorRadius')});
  });
}

function setSpeeds(robot, left, right) {
  const [lCoeff, rCoeff, servoStop, servoSpread] = [
    robot.get('leftServoCoeff'), robot.get('rightServoCoeff'),
    robot.get('servoStop'), robot.get('servoSpeedSpread')
  ];

  left = Math.min(Math.max(left, -1), 1);
  right = Math.min(Math.max(right, -1), 1);

  const leftWheel = servoStop + (servoSpread * left) * lCoeff;
  const rightWheel = servoStop + (servoSpread * right) * rCoeff;

  return robot.set('leftWheel', leftWheel).set('rightWheel', rightWheel);
}

function stop(robot) {
  return setSpeeds(robot, 0, 0);
}

function updateRobotState(robot) {
  const sensors = readSensors(robot);
  robot = robot.set('sensorTimeout', robot.get('sensorTimeout') - robot.get('sensorInterval'));

  if (robot.get('sensorTimeout') < 0 && sensors.every(s => !s)) {
    robot = stop(robot);
  } else {
    // FIXME: Get proper servo speeds
    // const speeds = getServoSpeedsForSensorInput(sensors);
    const speeds = [1, 1];
    setSpeeds(speeds[0], speeds[1]);
  }

  if (sensors.some(s => s)) {
    robot = robot.set('sensorTimeout', robot.get('noSensorStopTimeout'));
  }

  return robot;
}

function move(robot, moveDuration) {
  const [
    x, y,
    leftSpeed, rightSpeed
  ] = [
    robot.getIn(['position', 'x']), robot.getIn(['position', 'y']),
    robot.getIn(['speed', 'left']), robot.getIn(['speed', 'right'])
  ];

  const leftDelta = moveDuration * leftSpeed;
  const rightDelta = moveDuration * rightSpeed;

  let newX, newY;
  if (Math.abs(leftSpeed - rightSpeed) >= 1.0e-6) {
    const r = robot.get('wheelBase') * (leftDelta + rightDelta) / (2 * (rightDelta - leftDelta));
    const wd = (rightDelta - leftDelta) / robot.get('wheelBase');
    // convert to radians (may wanna have a function for that)
    newX = x + r * Math.sin(Math.PI / 180 * (wd + robot.get('rotation'))) - r * Math.sin(Math.PI / 180 * robot.get('rotation'));
    newY = y - r * Math.cos(Math.PI / 180 * (wd + robot.get('rotation'))) + r * Math.cos(Math.PI / 180 * robot.get('rotation'));

    robot.set('rotation', robot.get('rotation') + wd);
  } else {
    newX = x + (leftDelta * Math.cos(Math.PI / 180 * robot.get('rotation')));
    newY = y + (rightDelta * Math.sin(Math.PI / 180 * robot.get('rotation')));
  }

  return robot.update('position', pos => {
    return pos
      .set('x', roundWithPrecision(newX, POSITION_PRECISION))
      .set('y', roundWithPrecision(newY, POSITION_PRECISION))
  });
}


export default (state = initialState, action) => {
  const {
    type,
    payload
  } = action;

  switch (type) {
    /**
     * Set speed of both wheels where 1 is the maximum speed and -1 is the maximum
     * in reverse.
     *
     * @param left Speed for the left wheel <-1, 1>.
     * @param right Speed for the right wheel <-1, 1>.
     */
    case setSpeedCoeff.type: {
      const {left, right} = payload;
      return setSpeeds(left, right);
    }

    case tick.type: {
      const { world, duration } = payload;
      state = updateRobotState(state, world);
      return move(state, duration || state.get('sensorInterval'));
    }

    default:
      return state;
  }
};