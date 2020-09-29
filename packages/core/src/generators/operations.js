export const OPERATIONS = {
  create: {
    method: 'post', // request's http verb
    multiple: false, // is the request result an array of items?
    identified: false, // does the endpoint require the item's identifier?
  },
  read: {
    method: 'get',
    multiple: false,
    identified: true,
  },
  update: {
    method: 'put',
    multiple: false,
    identified: true,
  },
  delete: {
    method: 'delete',
    multiple: false,
    identified: true,
  },
  list: {
    method: 'get',
    multiple: true,
    identified: false,
  },
};

// makes sure that included and excluded operations are valid, e.g.
// include ['create', 'asd']                       => ['create']
// exclude ['create', 'read']                      => ['update', 'delete', 'list']
// include ['create', 'read'] + exclude ['create'] => ['read']
export function filter(config = {}) {
  const include = config.include || [];
  const exclude = config.exclude || [];

  let operations = Object.keys(OPERATIONS);

  if (include.length) {
    // allow only default operations to be included
    operations = operations.filter((o) => include.indexOf(o) > -1);
  }

  if (exclude.length) {
    // filter out operations
    operations = operations.filter((o) => exclude.indexOf(o) === -1);
  }

  return operations;
}

export default function operationsGenerator(key, config = {}) {
  function reducer(obj, operation) {
    // eslint-disable-next-line no-param-reassign
    obj[operation] = OPERATIONS[operation];

    return obj;
  }

  // returns included default operations, i.e.
  // {
  //   create: { multiple: false, identified: false, (...) },
  //   read: { multiple: false, identified: true, (...) },
  //   (...)
  // }
  return filter(config).reduce(reducer, {});
}
