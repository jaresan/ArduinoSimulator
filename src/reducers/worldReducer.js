import { fromJS } from 'immutable';
import { changePosition } from 'actions/worldActions';

export const initialState = fromJS({});

export default (state = initialState, action) => {
  const {
    type,
    payload
  } = action;

  switch (type) {
    case changePosition.type:
      return state.set('wtf', true);

    default:
      return state;
  }
};