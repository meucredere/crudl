import operationsGenerator from '@/generators/operations';
import { shouldUpdateItemOrItems } from '@/executors/modifiers';

export default function dataGenerator(key, config = {}) {
  const operations = operationsGenerator(key, config);

  function reducer(obj, operation) {
    // eslint-disable-next-line no-param-reassign
    obj[operation] = {
      loading: false,
      failure: null,
      [shouldUpdateItemOrItems(operation)]: {},
      config: {},
    };

    return obj;
  }

  // returns included default operations' data, e.g.
  // {
  //   create: {
  //     loading: false,
  //     failure: null,
  //     item: {},
  //     config: {},
  //   },
  //   list: {
  //     loading: false,
  //     failure: null,
  //     items: {},
  //     config: {},
  //   },
  //   (...)
  // }
  return Object.keys(operations).reduce(reducer, {});
}
