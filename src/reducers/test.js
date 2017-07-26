((robot, sensors) => {
  function loop(sensors) {

  }

  return loop.bind(robot)(sensors);
})(robot, robot.get('sensors'));

const component = {};
const code =
  `
  ((robot, sensors) => {
    ${component.value};
    return loop.bind(robot)(sensors);
  })(robot, robot.get('sensorReadings'))
  `;