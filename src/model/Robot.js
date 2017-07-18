import { rotatePoint, roundWithPrecision } from 'utils';

const positionPrecision = 9;

/**
 * Class representing a simulated robot.
 */
class Robot {
  /**
   *
   * @returns {{left: number, right: number}}
   */
  get speed() {
    // Signifies instant left/right wheel speed
    return {
      left: this.leftServoCoeff * ((this.leftWheel - this.servoStop) / this.servoSpeedSpread) * this.maxSpeed,
      right: this.rightServoCoeff * ((this.rightWheel - this.servoStop) / this.servoSpeedSpread) * this.maxSpeed
    };
  }

  get stopped() {
    return this.leftWheel === this.rightWheel && this.rightWheel === this.servoStop;
  }

  constructor(params) {
    for (let key in params) {
      if (this[key] === undefined) {
        this[key] = params[key];
      }
    }

    this.sensorTimeout = this.noSensorStopTimeout;
    this.setSpeedCoeff(params.startSpeedCoeff[0], params.startSpeedCoeff[1]);
  }

  getServoSpeedsForSensorInput(sensors) {
    // FIXME: Added by user

  }

  /**
   * Set speed of both wheels where 1 is the maximum speed and -1 is the maximum
   * in reverse.
   *
   * @param left Speed for the left wheel <-1, 1>.
   * @param right Speed for the right wheel <-1, 1>.
   */
  setSpeedCoeff(left, right) {
    this.leftWheel = this.servoStop + (this.servoSpeedSpread * left) * this.leftServoCoeff;
    this.rightWheel = this.servoStop + (this.servoSpeedSpread * right) * this.rightServoCoeff;
  }

  getSensorPosition(deltaX, deltaY) {
    const {x, y} = this.position;
    return rotatePoint(x, y, x + deltaX, y + deltaY, this.rotation);
  }

  readSensors(world) {
    return this.sensorDeltas.map(([deltaX, deltaY]) => {
      const [x, y] = this.getSensorPosition(deltaX, deltaY);
      return world.canSeeLine(x, y, this.sensorRadius) ? 1 : 0;
    });
  }

  updateState(world) {
    const sensors = this.readSensors(world);
    this.sensorTimeout -= this.sensorInterval;
    if (this.sensorTimeout < 0 && sensors.every(s => !s)) {
      this.stop();
    } else {
      const speeds = this.getServoSpeedsForSensorInput(sensors);
      this.setSpeedCoeff(speeds[0], speeds[1]);
    }

    if (sensors.some(s => s)) {
      this.sensorTimeout = this.noSensorStopTimeout;
    }
  }

  tick(world, sensorIntervalInS) {
    this.updateState(world);
    this.move(sensorIntervalInS || this.sensorInterval);
  }

  move(moveDuration) {
    const {x, y} = this.position;
    const {left: leftSpeed, right: rightSpeed} = this.speed;
    const leftDelta = moveDuration * leftSpeed;
    const rightDelta = moveDuration * rightSpeed;

    let newX, newY;
    if (Math.abs(leftSpeed - rightSpeed) >= 1.0e-6) {
      const r = this.wheelBase * (leftDelta + rightDelta) / (2 * (rightDelta - leftDelta));
      const wd = (rightDelta - leftDelta) / this.wheelBase;
      // convert to radians (may wanna have a function for that)
      newX = x + r * Math.sin(Math.PI / 180 * (wd + this.rotation)) - r * Math.sin(Math.PI / 180 * this.rotation);
      newY = y - r * Math.cos(Math.PI / 180 * (wd + this.rotation)) + r * Math.cos(Math.PI / 180 * this.rotation);

      this.rotation = this.rotation + wd;
    } else {
      newX = x + (leftDelta * Math.cos(Math.PI / 180 * this.rotation));
      newY = y + (rightDelta * Math.sin(Math.PI / 180 * this.rotation));
    }

    this.position = {
      x: roundWithPrecision(newX, positionPrecision),
      y: roundWithPrecision(newY, positionPrecision)
    };

    return [newX, newY];
  }

  runUntilStop(world, fitnessTicker) {
    let fitnessValue = 0;

    this.tick(world);
    fitnessValue += fitnessTicker();
    let iteration = 0;
    const maxIterations = 10000;
    while (!this.stopped && iteration < maxIterations) {
      this.tick(world);
      fitnessValue += fitnessTicker();
      iteration++;
    }

    //let net = this.behavior.neuralNet;
    //let largeNetPenalty = (net.input + net.output) / net.nodes.length;
    //fitnessValue *= largeNetPenalty;
    return fitnessValue;
  }

  stop() {
    this.setSpeedCoeff(0, 0);
  }

}

export default Robot;