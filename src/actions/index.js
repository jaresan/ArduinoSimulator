import * as RobotActions from './robotActions';

const actions = [RobotActions];

export default actions.reduce((acc, e) => {
  const [actions, namespace] = [e.actions, e.namespace];
  acc[namespace] = {};
  for (let action in actions) {
    if (actions.hasOwnProperty(action)) {
      acc[namespace][action] = (...args) => {
        return {
          type: actions[action],
          payload: actions[action](...args)
        }
      }
    }
  }
  return acc;
}, {});