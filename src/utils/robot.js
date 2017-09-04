import { fromJS, List } from 'immutable';
import { canSeeLine } from 'reducers/worldReducer';
import { rotatePoint, roundWithPrecision } from 'utils';
import { POSITION_PRECISION, MAX_SERVO_SIGNAL, MIN_SERVO_SIGNAL } from 'constants/robot';

function getSensorPosition(robot, deltaX, deltaY) {
  const [x, y] = [robot.getIn(['position', 'x']), robot.getIn(['position', 'y'])];
  return rotatePoint(x, y, x + deltaX, y + deltaY, robot.get('rotation'));
}

function getSensorPositions(robot) {
  return robot.get('sensorDeltas').reduce(
    (acc, [deltaX, deltaY]) => acc.push(getSensorPosition(robot, deltaX, deltaY)),
    List()
  );
}

function updateSensors(robot, field) {
  const positions = getSensorPositions(robot);
  const readings = positions.map(([x, y]) => canSeeLine({x, y, field, radius: robot.get('sensorRadius')}));

  return robot
    .set('sensorPositions', positions)
    .set('sensorReadings', readings);
}

function mergeRobotState(robot, newState) {
  const leftWheel = Math.max(MIN_SERVO_SIGNAL, Math.min(MAX_SERVO_SIGNAL, newState.leftWheel));
  const rightWheel = Math.max(MIN_SERVO_SIGNAL, Math.min(MAX_SERVO_SIGNAL, newState.rightWheel));

  robot = robot
    .set('leftWheel', leftWheel)
    .set('rightWheel', rightWheel);

  delete(newState.leftWheel);
  delete(newState.rightWheel);

  const newMemory = robot.get('memory').merge(fromJS(newState));

  return robot.set('memory', newMemory);
}

function setupRobot(robot, setupFn) {
  return mergeRobotState(robot, setupFn({}));
}

function applyBehavior(robot, behavior) {
  const sensorReadings = robot.get('sensorReadings');

  const robotState = {
    leftWheel: robot.get('leftWheel'),
    rightWheel: robot.get('rightWheel'),
    ...robot.get('memory').toJS()
  };
  const newState = behavior(robotState, sensorReadings);

  return mergeRobotState(robot, newState);
}

function moveRobot(robot, moveDuration) {
  const [x, y] = [robot.getIn(['position', 'x']), robot.getIn(['position', 'y'])];
  const {left: leftSpeed, right: rightSpeed} = getWheelSpeeds(robot);

  const leftDelta = moveDuration * leftSpeed;
  const rightDelta = moveDuration * rightSpeed;

  let newX, newY;
  if (Math.abs(leftDelta - rightDelta) >= 1.0e-6) {
    const r = robot.get('wheelBase') * (rightDelta + leftDelta) / (2 * (rightDelta - leftDelta));
    const wd = (rightSpeed - leftSpeed) / robot.get('wheelBase');
    // convert to radians (may wanna have a function for that)
    newX = x + r * Math.sin(Math.PI / 180 * (wd + robot.get('rotation'))) - r * Math.sin(Math.PI / 180 * robot.get('rotation'));
    newY = y - r * Math.cos(Math.PI / 180 * (wd + robot.get('rotation'))) + r * Math.cos(Math.PI / 180 * robot.get('rotation'));

    let newRotation = (robot.get('rotation') + wd) % 360;
    if (newRotation < 0) {
      newRotation = 360 + newRotation;
    }
    robot = robot.set('rotation', newRotation);
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

function getWheelSpeeds(robot) {
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

export default {
  updateSensors,
  moveRobot,
  setupRobot,
  applyBehavior,
  getSensorPositions
}