import operationsGenerator from '@/generators/operations';
import keysGenerator from '@/generators/keys';
import constantsGenerator from '@/generators/constants';

import {
  cleanModifier,
  startModifier,
  successModifier,
  failureModifier,
} from '@/executors/modifiers';

// should the modifier preserve the original data object?
// e.g. Vuex does, Redux doesn't
export function spreadModifyingData(data, config = {}) {
  return config.spread ? { ...data } : data;
}

export function modifierExecutorGenerator(key, operation, types, config = {}) {
  const executor = config.modifierExecutor || {
    clean: cleanModifier,
    start: startModifier,
    success: successModifier,
    failure: failureModifier,
  };

  // check out executors/modifiers.js (default crudl modifiers) for more info
  return {
    [types.clean](data) {
      return executor.clean(key, operation, spreadModifyingData(data, config));
    },
    [types.start](data, payload) {
      return executor.start(key, operation, spreadModifyingData(data, config), payload);
    },
    [types.success](data, response) {
      return executor.success(key, operation, spreadModifyingData(data, config), response);
    },
    [types.failure](data, error) {
      return executor.failure(key, operation, spreadModifyingData(data, config), error);
    },
  };
}

export default function modifiersGenerator(key, config = {}) {
  const operations = operationsGenerator(key, config);
  const keys = keysGenerator(key, config);
  const constants = constantsGenerator(key, config);

  function reducer(obj, operation) {
    // eslint-disable-next-line no-param-reassign
    obj = {
      ...obj,
      ...modifierExecutorGenerator(
        keys[operation],
        operation,
        constants[operation],
        config,
      ),
    };

    return obj;
  }

  // returns included default operations' modifier executors, i.e.
  // {
  //   CRUDL/MODULE_KEY/READ/START: executeReadStart(...),
  //   CRUDL/MODULE_KEY/READ/SUCCESS: executeReadSuccess(...),
  //   (...)
  //   CRUDL/MODULE_KEY/DELETE/START: executeDeleteStart(...),
  //   CRUDL/MODULE_KEY/DELETE/SUCCESS: executeDeleteSuccess(...),
  //   (...)
  // }
  return Object.keys(operations).reduce(reducer, {});
}
