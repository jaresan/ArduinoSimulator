import { fromJS } from 'immutable';
import { r_tick } from 'actions/robotActions';
import { rotatePoint, roundWithPrecision } from 'utils';
import { canSeeLine } from './worldReducer';

const POSITION_PRECISION = 9;
export const initialState = fromJS({
  sensorPositions: [],
  sensorReadings: [],
  noSensorStopTimeout: 200, // When no sensors can see anything, stop after this time
  sensorTimeoutPool: 200,
  leftWheel: 0.3, // Initial speed as a coefficient of max speed
  rightWheel: 0.3, // Initial speed as a coefficient of max speed
  position: {
    x: 0.50,
    y: 0.875,
  },
  sensorInterval: 0.02, // in seconds, period of how often the sensors scan
  maxSpeed: 0.2, // in meters per second
  servoStop: 1500, // hardwired value of the servo motors (1300 = full reverse, 1700 = full forward)
  servoSpeedSpread: 200, // range between the "stop" state and full speed of the servo
  leftServoCoeff: 1, // wheels are on opposite sides - compensate clockwise/counterclockwise difference
  rightServoCoeff: -1,
  rotation: 180, // in degrees, starting rotation of the robot (0 is to the right)
  wheelBase: 0.105, // in meters, distance between the wheels
  sensorDeltas: [ // Sensor position in relation to the center of the wheel axis -> [deltaX, deltaY] in meters
    [0.04, 0.05],
    [0.04, 0.015],
    [0.04, 0],
    [0.04, -0.015],
    [0.04, -0.05]
  ],
  sensorRadius: 0.0015, // Half of the square side of the sensor (to know how much the sensor can see)
});


function getSensorPosition(robot, deltaX, deltaY) {
  const [x, y] = [robot.getIn(['position', 'x']), robot.getIn(['position', 'y'])];
  return rotatePoint(x, y, x + deltaX, y + deltaY, robot.get('rotation'));
}

function getSensorPositions(robot) {
  return robot.get('sensorDeltas').reduce(
    (acc, [deltaX, deltaY]) =>
      acc.push(getSensorPosition(robot, deltaX, deltaY)), fromJS([])
  );
}

function updateSensors(robot, field) {
  const positions = getSensorPositions(robot);
  const readings = positions.map(([x, y]) => canSeeLine({x, y, field, sensorRadius: robot.get('sensorRadius')}));

  return robot
    .set('sensorPositions', positions)
    .set('sensorReadings', readings);
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
  const [timeout, interval] = [robot.get('sensorTimeoutPool'), robot.get('sensorInterval')];

  const sensorReadings = robot.get('sensorReadings');

  if ((timeout - interval) < 0 && sensorReadings.every(s => !s)) {
    robot = stop(robot);
  } else {
    // FIXME: Get proper servo speeds
    // const speeds = getServoSpeedsForSensorInput(sensors);
    const speeds = [1, 1];
    setSpeeds(robot, speeds[0], speeds[1]);
  }

  if (sensorReadings.some(s => s)) {
    robot = robot.set('sensorTimeoutPool', robot.get('noSensorStopTimeout'));
  } else {
    robot = robot.set('sensorTimeoutPool', timeout - interval);
  }

  return robot;
}

function move(robot, moveDuration) {
  const [x, y] = [robot.getIn(['position', 'x']), robot.getIn(['position', 'y'])];
  const {left: leftSpeed, right: rightSpeed} = getSpeedCoeffs(robot);

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

  console.log('Position 1 - ', robot.get('position').toJS());
  robot = robot.update('position', pos => {
    return pos
      .set('x', roundWithPrecision(newX, POSITION_PRECISION))
      .set('y', roundWithPrecision(newY, POSITION_PRECISION))
  });
  console.log('Position 2 - ', robot.get('position').toJS());
  return robot;
}

export function getSpeedCoeffs(robot) {
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


export default (state = initialState, action) => {
  const {
    type,
    payload
  } = action;

  switch (type) {
    case r_tick.type: {
      const {field, duration} = payload;

      state = updateSensors(state, field);
      state = updateRobotState(state);
      return move(state, duration || state.get('sensorInterval'));
    }

    default:
      return state;
  }
};