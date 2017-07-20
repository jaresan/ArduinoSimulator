import { fromJS } from 'immutable';
import { changePosition } from 'actions/robotActions';

export const initialState = fromJS({});

export default (state = initialState, action) => {
  const {
    type,
    payload
  } = action;

  switch (type) {
    case changePosition.type:
      console.log('TY PICO');
      return state.set('wtf', true);

    default:
      return state;
  }
};