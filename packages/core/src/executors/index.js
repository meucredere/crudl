import {
  // item: [create, read, update, delete]
  // items: [list]
  shouldUpdateItemOrItems,

  // should the new request overwrite the existing data?
  // this is useful for things like items pagination or
  // refreshing the page without "flashing" it to empty state and back
  shouldOverwriteExistingItems,

  // unwraps results, handles pluralized keys,
  // transforms data like [{ id: 1 }, { id: 2 }] into { 1: { id: 1 }, 2: { id: 2 }}
  // ... and more :D
  extractResponseData,

  // should the original data object be modified?
  shouldSpreadExistingData,

  // makes a copy of the original data
  spreadExistingData,
} from '@/executors/helpers';

// cleans data: resets the operation data to its initial schema
export function clean(key, operation, config, data) {
  const modified = shouldSpreadExistingData(config) ? spreadExistingData(operation, data) : data;

  modified[operation.name][shouldUpdateItemOrItems(operation)] = {};
  modified[operation.name].loading = false;
  modified[operation.name].failure = null;
  modified[operation.name].config = {};

  return modified;
}

// starts the request: cleans errors and starts loading
export function start(key, operation, config, data, payload = {}) {
  const modified = shouldSpreadExistingData(config) ? spreadExistingData(operation, data) : data;

  // config should always be set first on start,
  // so configs like 'preserve' are taken into account
  modified[operation.name].config = { ...payload.crudl };

  if (shouldOverwriteExistingItems(data, operation)) {
    modified[operation.name][shouldUpdateItemOrItems(operation)] = {};
  }

  modified[operation.name].loading = true;
  modified[operation.name].failure = null;

  return modified;
}

// successfull request: sets the new data, cleans errors and stops loading
export function success(key, operation, config, data, response = {}) {
  const modified = shouldSpreadExistingData(config) ? spreadExistingData(operation, data) : data;

  modified[operation.name][shouldUpdateItemOrItems(operation)] = extractResponseData(
    key,
    operation,
    config,
    data,
    response,
  );

  modified[operation.name].failure = null;
  modified[operation.name].loading = false;
  modified[operation.name].config = {};

  return modified;
}

// failed request: sets error details and stops loading
export function failure(key, operation, config, data, error = {}) {
  const modified = shouldSpreadExistingData(config) ? spreadExistingData(operation, data) : data;

  // overwrite current data on new request failure?
  if (shouldOverwriteExistingItems(data, operation)) {
    modified[operation.name][shouldUpdateItemOrItems(operation)] = {};
  }

  // checks if the server responded with something (like validation errors)
  // otherwise, returns the error object itself
  let message = error;

  if (error.response) {
    message = error.response.data || error.response;
  }

  modified[operation.name].failure = message;
  modified[operation.name].loading = false;
  modified[operation.name].config = {};

  return modified;
}
