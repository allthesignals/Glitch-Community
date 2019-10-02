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

export const itemsResponse = (items = [], options) => {
  return {
    items: [...items],
    limit: 100,
    orderKey: 'createdAt',
    orderDirection: 'ASC',
    lastOrderValue: null,
    hasMore: false,
    ...options,
  };
};

export default {
  keyByValueResponse,
  itemsResponse,
};
