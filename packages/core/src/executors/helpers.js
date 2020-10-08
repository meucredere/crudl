// returns 'items' as result property for multiple items operations or 'item' for single ones
// so create -> item, read -> item, list -> items, (...)
export function shouldUpdateItemOrItems(operation) {
  return operation.multiple ? 'items' : 'item';
}

// internal crudl control to check if it should preseve previous data on new requests, for example,
// appending new items to the existing list or refreshing identified items without flashing the page
export function shouldOverwriteExistingItems(data, operation) {
  try {
    return !data[operation.name].config.preserve;
  } catch (err) {
    return true;
  }
}

// transforms data like
// [{ id: 1, name: a }, { id: 12, name: b }]
// into
// { 1: { id: 1, name: a }, 12: { id: 12, name: b } }
export function extractResponseDataArray(items = [], identifier = 'id') {
  function reducer(obj, item) {
    // eslint-disable-next-line no-param-reassign
    obj[item[identifier]] = item;

    return obj;
  }

  return items.reduce(reducer, {});
}

export function extractResponseData(key, operation, config, data, response) {
  const {
    multiple,
  } = operation;

  let result;

  try {
    result = key ? response.data[key] : response.data;
  } catch (err) { /* */ }

  if ([undefined, null].indexOf(result) > -1) {
    result = multiple ? [] : {};
  }

  // returns the item if it is a single item operation
  if (!multiple) {
    return result;
  }

  // returns the new keyed object of items for multiple items operations that do not preserve data
  if (shouldOverwriteExistingItems(data, operation)) {
    return extractResponseDataArray(result, config.identifier);
  }

  // appends new results to the existing items data if the request is configured to preserve it
  // worth noticing that it overwrites (updates?) existing items using the same primary key
  return {
    ...data[operation.name][shouldUpdateItemOrItems(operation)],
    // transforms the data array into a keyed object using the
    // custom primary key config (default identifier's fallback is "id")
    ...extractResponseDataArray(result, config.identifier),
  };
}

// should the modifier modify the original data object?
export function shouldSpreadExistingData(config) {
  return config.spread;
}

// copies the original data object so it stays intact
export function spreadExistingData(operation, data) {
  const itemOrItems = shouldUpdateItemOrItems(operation);

  return {
    ...data,
    [operation.name]: {
      ...data[operation.name],
      [itemOrItems]: {
        ...data[operation.name][itemOrItems],
      },
    },
  };
}
