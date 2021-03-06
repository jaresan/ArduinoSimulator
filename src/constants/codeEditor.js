export const DEFAULT_CODE = `\
function setup() {
  this.leftWheel = 1700;
  this.rightWheel = 1700;
}

function loop(sensors) {
  
}`;


export const EXAMPLE = `\
function setup() {
  this.leftWheel = 1700;
  this.rightWheel = 1700;
  this.turnFlag = false;
}

function loop(sensors) {
  if (!this.turnFlag) {
    this.leftWheel -= 20;
  } else {
    this.leftWheel += 20;
  }
  
  if (this.leftWheel === 1700) {
    this.turnFlag = false;
  }
  
  if (this.leftWheel === 1300) {
    this.turnFlag = true;
  }
}
`;


export const NEURAL_NET = `\
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

function getWheelSignals(robot, left, right) {
  const [lCoeff, rCoeff, servoStop, servoSpread] = [1, -1, 1500, 200];

  const leftWheel = servoStop + (servoSpread * left) * lCoeff;
  const rightWheel = servoStop + (servoSpread * right) * rCoeff;

  return [leftWheel, rightWheel];
}

function setup() {

}

function loop(sensors) {
  const coeffs = getSpeedCoeffs(sensors);
  const wheelSignals = getWheelSignals(this, coeffs[0], coeffs[1]);
  this.leftWheel = wheelSignals[0];
  this.rightWheel = wheelSignals[1];
}
`;