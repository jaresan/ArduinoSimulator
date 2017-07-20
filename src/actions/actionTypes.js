let index = 0;
export function createAction(action, name) {
  const type = name ? name : ++index + '';
  const result = (...args) => {
    return {
      type: type,
      payload: action(...args)
    }
  };
  result.type = type;
  return result;
}