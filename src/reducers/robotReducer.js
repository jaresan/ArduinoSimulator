import { fromJS } from 'immutable';
import { changePosition } from 'actions/robotActions';
import RobotParams from 'constants/RobotParams'

export const initialState = fromJS({}).merge(RobotParams);

export default (state = initialState, action) => {
  const {
    type,
    payload
  } = action;

  switch (type) {
    case changePosition.type:
      return state.update('position', p => {
        return {
          x: p.x + payload.dX,
          y: p.y + payload.dY
        }
      });

    default:
      return state;
  }
};