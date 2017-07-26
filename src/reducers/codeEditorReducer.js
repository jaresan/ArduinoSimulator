import { fromJS } from 'immutable';
import { r_saveCode } from 'actions/codeEditorActions';

export const initialState = fromJS({
  code: ''
});

export default (state = initialState, action) => {
  const {
    type,
    payload
  } = action;

  switch (type) {
    case r_saveCode.type:
      return state.set('code', payload.code);

    default:
      return state;
  }
};