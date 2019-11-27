import reduce from 'lodash/reduce';

export const keyByValueResponse = (array, key) =>
  reduce(
    array,
    (result, object) =>
      Object.assign(result, {
        [object[key]]: object,
      }),
    {},
  );

export const itemsResponse = (items = []) => {
  return {
    items: [...items],
  };
};

export default {
  keyByValueResponse,
  itemsResponse,
};
