import { pluralizeAndSnakeCase } from '@/generators/keys';
import operationsGenerator from '@/generators/operations';

export default function endpointsGenerator(key, config = {}) {
  const operations = operationsGenerator(key, config);

  function reducer(obj, operation) {
    // generates the pluralized "/some_items" endpoint
    let endpoint = `/${pluralizeAndSnakeCase(key)}`;

    // for identified items operations,
    // adds :id to generate the "/some_items/:id" endpoint
    if (operations[operation].identified) {
      endpoint += '/:id';
    }

    // eslint-disable-next-line no-param-reassign
    obj[operation] = endpoint;

    return obj;
  }

  // returns included default operations' endpoints, e.g.
  // {
  //   create: /some_items,
  //   update: /some_items/:id,
  //   (...)
  // }
  return {
    ...Object.keys(operations).reduce(reducer, {}),

    // overwrites default endpoints with custom ones in case they were given
    ...config.endpoints,
  };
}
