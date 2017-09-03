import { createSelector } from 'reselect';
import { getCodeEditor } from 'selectors';

export const getRobotFunctions = createSelector(
  getCodeEditor,
  editor => ({
    setupFunction: `() => {
        const mutableState = {};
        ${editor.get('code')};
        setup.bind(mutableState)();
        return mutableState;
      }
    `,

    loopFunction: `(robot, sensors) => {
        const mutableState = robot;
        ${editor.get('code')};
        loop.bind(mutableState)(sensors);
        return mutableState;
      }
    `
  })
);

export const getCode = createSelector(
  getCodeEditor,
  editor => editor.get('code')
);