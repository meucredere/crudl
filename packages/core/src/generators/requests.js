import operationsGenerator from '@/generators/operations';
import endpointsGenerator from '@/generators/endpoints';
import methodsGenerator from '@/generators/methods';
import constantsGenerator from '@/generators/constants';

import { defaultClient } from '@/clients/default';

import urlCompiler from '@/helpers/urls';

export function requestGenerator(key, operation, method, endpoint, constants, config = {}) {
  const client = config.client || defaultClient;

  // the first param, "executor", is designed to be the default framework action param, like
  // dispatch() for Redux (thunk), or
  // { commit(), (...) } for Vuex
  return function generatedRequest(executor, payload) {
    const {
      // compiled url with named parameters
      // i.e. /foo/:id -> /foo/1
      url,
      // remove said named parameters from the sending data
      // so the result url isn't /foo/1?id=1 but /foo/1 instead
      data,
    } = urlCompiler(endpoint, payload);

    // remove crudl's internal request config from the sending request data
    delete data.crudl;

    const request = {
      method,
      [method === 'get' ? 'params' : 'data']: data,
    };

    function start(resolve, reject) {
      // calls the start modifier executor to set loading state as true, etc
      executor(constants.start, payload);

      function success(response) {
        // calls the success modifier executor with the http client's response object
        executor(constants.success, response);
        resolve(response);
      }

      function failure(error) {
        // calls the failure modifier executor with the http client's error object
        executor(constants.failure, error);
        reject(error);
      }

      return client(url, request)
        .then(success)
        .catch(failure);
    }

    function cancel() {}
    return new Promise(start).catch(cancel);
  };
}

export default function requestsGenerator(key, config = {}) {
  const operations = operationsGenerator(key, config);
  const endpoints = endpointsGenerator(key, config);
  const methods = methodsGenerator(key, config);
  const constants = constantsGenerator(key, config);

  function reducer(obj, operation) {
    // eslint-disable-next-line no-param-reassign
    obj[operation] = requestGenerator(
      key,
      operation,
      methods[operation],
      endpoints[operation],
      constants[operation],
      config,
    );

    return obj;
  }

  // returns included default operations' requests, i.e.
  // {
  //   create() { startCreateModifier(); successCreateModifier() || failureCreateModifier() },
  //   read() { startReadModifier(); successReadModifier() || failureReadModifier() },
  //   (...)
  // }
  return Object.keys(operations).reduce(reducer, {});
}
