const createAction = (action, name) => {
  const type = name ? name : createAction.index++ + '';
  const result = (...args) => {
    return {
      type: type,
      payload: action(...args)
    }
  };
  result.type = type;
  return result;
};
createAction.index = 0;

export { createAction };