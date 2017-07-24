export const POSITION_PRECISION = 9;

// parameters of the simulated arduino robot
export const ROBOT_PARAMS = {
  inputSize: 5,
  outputSize: 2,
  position: {
    x: 0.50,
    y: 0.875,
  },
  noSensorStopTimeout: 200, // When no sensors can see anything, stop after this time
  sensorInterval: 0.02, // in seconds, period of how often the sensors scan
  maxSpeed: 0.2, // in meters per second
  startSpeedCoeff: [0.3, 0.3], // in portion of max speed
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
  behavior: { // controller of the robot
    neuralNet: { // default dummy network
      activate: () => [-100, -100]
    },
    absoluteMin: -1,
    absoluteMax: 1
  }
};