import { fromJS } from 'immutable';

const initialState = fromJS({});

export default (state = initialState, action) => {
  const {
    type,
    // payload
  } = action;

  switch (type) {
    default:
      return state;
  }
};