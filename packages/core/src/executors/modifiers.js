/* eslint no-param-reassign: [error, { ignorePropertyModificationsFor: [data] }] */

import { OPERATIONS } from '@/generators/operations';

// returns 'items' as result property for multiple items operations or 'item' for single ones
// so create -> item, read -> item, list -> items, (...)
export function shouldUpdateItemOrItems(operation) {
  return OPERATIONS[operation].multiple ? 'items' : 'item';
}

// internal crudl control to check if it should preseve previous data on new requests, for example,
// appending new items to the existing list or refreshing identified items without flashing the page
export function shouldOverwriteData(response) {
  try {
    return !response.config.crudl.preserveData;
  } catch (err) {
    return true;
  }
}

// modifies data like
// [{ id: 1, name: a }, { id: 12, name: b }]
// to
// { 1: { id: 1, name: a }, 12: { id: 12, name: b } }
export function prepareModifyingDataArray(items = [], property = 'id') {
  function reducer(obj, item) {
    // eslint-disable-next-line no-param-reassign
    obj[item[property]] = item;

    return obj;
  }

  return items.reduce(reducer, {});
}

export function prepareModifyingData(key, operation, data, response) {
  // check if the current operation is configured to be wrapped by a key and unwraps it if so
  const result = key ? response.data[key] : response.data;

  // returns the item if it is a single item operation
  if (!OPERATIONS[operation].multiple) {
    return result;
  }

  // returns the new keyed object of items for multiple items operations that do not preserve data
  if (shouldOverwriteData(response)) {
    return prepareModifyingDataArray(result);
  }

  // appends new results to the existing items data if the request is configured to preserve it
  // worth noticing that it overwrites (updates?) existing items using the same primary key
  return {
    ...data[operation][shouldUpdateItemOrItems(operation)],
    // transforms the data array into a keyed object using the
    // custom primary key config (default primary identifier fallback is "id")
    ...prepareModifyingDataArray(result),
  };
}

// (this modifier caller is living here just for easier third party frameworks extendability)
// the first param, "custom", is the default framework action param, like
// dispatch() for Redux, or
// { commit(), state(), getters(), dispatch() } for Vuex
export function modifierCaller(custom, constant, reponseOrError) {
  const args = [constant];

  if (reponseOrError !== undefined) {
    args.push(reponseOrError);
  }

  return custom(...args);
}

// cleans data: resets the operation data to its initial config
export function cleanModifier(key, operation, data) {
  data[operation][shouldUpdateItemOrItems(operation)] = {};
  data[operation].loading = false;
  data[operation].failure = null;

  return data;
}

// starts the request: cleans errors and starts loading
export function startModifier(key, operation, data, response) {
  // overwrite previous data on request start?
  if (shouldOverwriteData(response)) {
    data[operation][shouldUpdateItemOrItems(operation)] = {};
  }

  data[operation].loading = true;
  data[operation].failure = null;

  return data;
}

// successfull request: sets the new data, cleans errors and stops the loading
export function successModifier(key, operation, data, response) {
  data[operation][shouldUpdateItemOrItems(operation)] = prepareModifyingData(
    key,
    operation,
    data,
    response,
  );

  data[operation].failure = null;
  data[operation].loading = false;

  return data;
}

// successfull request: sets errors and stops the loading
export function failureModifier(key, operation, data, error) {
  // overwrite previous data on request failure?
  if (shouldOverwriteData(error.response)) {
    data[operation][shouldUpdateItemOrItems(operation)] = {};
  }

  // checks if the server responded with something (like validation errors)
  // otherwise, returns the error object itself
  data[operation].failure = error.response ? error.response.data : error;
  data[operation].loading = false;

  return data;
}
