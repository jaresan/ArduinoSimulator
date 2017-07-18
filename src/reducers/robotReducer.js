import { fromJS } from 'immutable';
import { actions as RobotActions } from 'actions/robotActions';

export const initialState = fromJS({});

export default (state = initialState, action) => {
  const {
    type,
    payload
  } = action;

  switch (type) {
    case RobotActions.changePosition:
      console.log('hovnooo');
      return state;

    default:
      return state;
  }
};