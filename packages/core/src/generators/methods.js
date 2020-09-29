import operationsGenerator from '@/generators/operations';

export default function methodsGenerator(key, config = {}) {
  const operations = operationsGenerator(key, config);

  function reducer(obj, operation) {
    // eslint-disable-next-line no-param-reassign
    obj[operation] = operations[operation].method;

    return obj;
  }

  // returns included default operations' methods, e.g.
  // {
  //   create: post,
  //   read: get,
  //   update: put,
  //   (...)
  // }
  return {
    ...Object.keys(operations).reduce(reducer, {}),

    // overwrites default methods with custom ones in case they were given
    ...config.methods,
  };
}
