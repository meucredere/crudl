import operationsGenerator from '@/generators/operations';

// generates default constants, e.g.
// CRUDL/MODULE_KEY/UPDATE/SUCCESS
export function constantGenerator(key, operation, type) {
  return `CRUDL/${key}/${operation}/${type}`.toUpperCase();
}

export default function constantsGenerator(key, config = {}) {
  const operations = operationsGenerator(key, config);

  function reducer(obj, operation) {
    // eslint-disable-next-line no-param-reassign
    obj[operation] = {
      clean: constantGenerator(key, operation, 'clean'),
      start: constantGenerator(key, operation, 'start'),
      success: constantGenerator(key, operation, 'success'),
      failure: constantGenerator(key, operation, 'failure'),
    };

    return obj;
  }

  // returns included default operations' keys, i.e.
  // {
  //   create: {
  //     start: CRUDL/MODULE_KEY/CREATE/START, success: CRUDL/MODULE_KEY/CREATE/SUCCESS, (...)
  //   },
  //   update: {
  //     start: CRUDL/MODULE_KEY/UPDATE/START, success: CRUDL/MODULE_KEY/UPDATE/SUCCESS, (...)
  //   },
  //   (...)
  // }
  return Object.keys(operations).reduce(reducer, {});
}
