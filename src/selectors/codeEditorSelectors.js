import { createSelector } from 'reselect';
import { getCodeEditor } from 'selectors';

export const getRobotFunction = createSelector(
  getCodeEditor,
  editor => {
    return `
      ((robot, sensors) => {
        ${editor.get('code')};
        return loop.bind(robot)(sensors);
      })
    `;
  }
);