import { fromJS } from 'immutable';
import { r_tick } from 'actions/robotActions';
import { rotatePoint, roundWithPrecision } from 'utils';
import { canSeeLine } from './worldReducer';

const POSITION_PRECISION = 9;
let initial = fromJS({
  sensorPositions: [],
  sensorReadings: [],
  noSensorStopTimeout: 200, // When no sensors can see anything, stop after this time
  sensorTimeoutPool: 200,
  leftWheel: 1600, // Initial speed as a coefficient of max speed
  rightWheel: 1400, // Initial speed as a coefficient of max speed
  position: {
    x: 0.50,
    y: 0.235,
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
initial = initial.set('sensorPositions', getSensorPositions(initial));

export const initialState = initial;


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
  const readings = positions.map(([x, y]) => canSeeLine({x, y, field, radius: robot.get('sensorRadius')}));

  return robot
    .set('sensorPositions', positions)
    .set('sensorReadings', readings);
}

function setSpeeds(robot, left, right) {
  const [lCoeff, rCoeff, servoStop, servoSpread] = [
    robot.get('leftServoCoeff'), robot.get('rightServoCoeff'),
    robot.get('servoStop'), robot.get('servoSpeedSpread')
  ];

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
    const speeds = getSpeedCoeffs(sensorReadings);
    robot = setSpeeds(robot, speeds[0], speeds[1]);
  }

  if (sensorReadings.some(s => s)) {
    robot = robot.set('sensorTimeoutPool', robot.get('noSensorStopTimeout'));
  } else {
    robot = robot.set('sensorTimeoutPool', timeout - interval);
  }

  return robot;
}

function move(robot) {
  // FIXME: FFS, how can we add moveDuration to this??
  const [x, y] = [robot.getIn(['position', 'x']), robot.getIn(['position', 'y'])];
  const {left: leftSpeed, right: rightSpeed} = getWheelSpeeds(robot);

  let newX, newY;
  if (Math.abs(leftSpeed - rightSpeed) >= 1.0e-6) {
    const r = robot.get('wheelBase') * (rightSpeed + leftSpeed) / (2 * (rightSpeed - leftSpeed));
    const wd = (rightSpeed - leftSpeed) / robot.get('wheelBase');
    // convert to radians (may wanna have a function for that)
    newX = x + r * Math.sin(Math.PI / 180 * (wd + robot.get('rotation'))) - r * Math.sin(Math.PI / 180 * robot.get('rotation'));
    newY = y - r * Math.cos(Math.PI / 180 * (wd + robot.get('rotation'))) + r * Math.cos(Math.PI / 180 * robot.get('rotation'));

    robot = robot.set('rotation', robot.get('rotation') + wd);
  } else {
    newX = x + (leftSpeed * Math.cos(Math.PI / 180 * robot.get('rotation')));
    newY = y + (rightSpeed * Math.sin(Math.PI / 180 * robot.get('rotation')));
  }

  return robot.update('position', pos => {
    return pos
      .set('x', roundWithPrecision(newX, POSITION_PRECISION))
      .set('y', roundWithPrecision(newY, POSITION_PRECISION))
  });
}

export function getWheelSpeeds(robot) {
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

const neuralCoeffs = [[0.4129606627615217,0.8641298225119673],[0.4129606627615217,0.864492604417018],[0.9999170099299433,-0.999388739013922],[0.9999170099299433,-0.9993861165346114],[0.999402886467294,0.9993775771499657],[0.999402886467294,0.9993793586062051],[0.9999837463807071,-0.8661505236669736],[0.9999837463807071,-0.8656147046038524],[-0.6546138126761802,0.9902249347344796],[-0.6546138126761802,0.9902527952223751],[0.9553526800307977,-0.9909680232737271],[0.9553526800307977,-0.9909294526626852],[0.03184430720590564,0.999958043000565],[0.03184430720590564,0.9999581630837409],[0.9998126009155974,0.031190472916745888],[0.9998126009155974,0.033329404672321525],[0.4129606627615217,0.8837286823955529],[0.4129606627615217,0.8840423892969514],[0.9960473661150672,-0.9992783027723218],[0.9960473661150672,-0.9992752078806277],[0.8495018203766445,0.9994728480845073],[0.8495018203766445,0.9994743564565003],[0.9992246162627797,-0.8438475579261203],[0.9992246162627797,-0.8432301917360919],[-0.6546138126761802,0.9917157895306322],[-0.6546138126761802,0.991739418482189],[0.9553526800307977,-0.9893433179295881],[0.9553526800307977,-0.9892978463899196],[0.03184430720590564,0.9999644686202428],[0.03184430720590564,0.9999645703132773],[0.9910956592703719,0.1137758925905202],[0.9910956592703719,0.11588801739011127]];

function getSpeedCoeffs(sensors) {
  sensors = sensors.toJS();
  let index = 0;
  for (let i = 0; i < 5; i++) {
    index = index << 1;
    if (sensors[i]) {
      index++;
    }
  }

  return neuralCoeffs[index];
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