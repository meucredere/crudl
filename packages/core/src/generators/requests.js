import operationsGenerator from '@/generators/operations';
import keysGenerator from '@/generators/keys';
import endpointsGenerator from '@/generators/endpoints';
import methodsGenerator from '@/generators/methods';
import constantsGenerator from '@/generators/constants';

import { defaultClient } from '@/clients/default';
import { modifierCaller } from '@/executors/modifiers';

import urlCompiler from '@/helpers/urls';

export function requestGenerator(key, operation, method, endpoint, constants, config = {}) {
  const modifierExecutor = config.modifierCaller || modifierCaller;
  const client = config.client || defaultClient;

  return function generatedRequest(custom, payload) {
    const {
      // compiled url with named parameters
      // i.e. /foo/:id -> /foo/1
      url,
      // remove said named parameters from the payload
      // so the result url isn't /foo/1?id=1 but /foo/1 instead
      striped,
    } = urlCompiler(endpoint, payload);

    delete striped.crudl;

    const request = {
      method,
      [method === 'get' ? 'params' : 'data']: striped,
    };

    // calls the start modifier executor to set loading state as true, etc
    modifierExecutor(custom, constants.start, payload);

    return new Promise((resolve, reject) => {
      client(url, request)
        .then((response) => {
          // calls the success modifier executor with the http client's response object
          modifierExecutor(custom, constants.success, response);
          resolve(response);
        })
        .catch((error) => {
          // calls the failure modifier executor with the http client's error object
          modifierExecutor(custom, constants.failure, error);
          reject(error);
        });
    });
  };
}

export default function requestsGenerator(key, config = {}) {
  const keys = keysGenerator(key, config);
  const operations = operationsGenerator(key, config);
  const endpoints = endpointsGenerator(key, config);
  const methods = methodsGenerator(key, config);
  const constants = constantsGenerator(key, config);

  function reducer(obj, operation) {
    // eslint-disable-next-line no-param-reassign
    obj[operation] = requestGenerator(
      keys[operation],
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
