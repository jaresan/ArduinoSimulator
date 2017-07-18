import { fromJS } from 'immutable';

export const initialState = fromJS({});

export default (state = initialState, action) => {
  const {
    type,
    payload
  } = action;

  switch (type) {
    default:
      return state;
  }
};