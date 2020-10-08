/* eslint no-underscore-dangle: ["error", { "allow": ["_client"] }] */

import snakeCase from '@/helpers/cases';
import urlCompiler from '@/helpers/urls';

import * as executors from '@/executors/index';

export default class CRUDL {
  static OPERATIONS = {
    create: {
      name: 'create',
      multiple: false, // is the request's result an array of items?
      identified: false, // does the endpoint require the item's identifier? (as in /posts/:id)
    },
    read: {
      name: 'read',
      multiple: false,
      identified: true,
    },
    update: {
      name: 'update',
      multiple: false,
      identified: true,
    },
    delete: {
      name: 'delete',
      multiple: false,
      identified: true,
    },
    list: {
      name: 'list',
      multiple: true,
      identified: false,
    },
  };

  static METHODS = {
    create: 'post', // operations' request http verb
    read: 'get',
    update: 'put',
    delete: 'delete',
    list: 'get',
  };

  static CLIENT() {
    // eslint-disable-next-line no-console
    console.log('No HTTP client was provided to crudl. Using Promise.resolve() for mocking purposes.');

    return Promise.resolve();
  }

  static get client() {
    if (this._client && Object.prototype.hasOwnProperty.call(this, '_client')) {
      return this._client;
    }

    return this.CLIENT;
  }

  static set client(custom) {
    this._client = custom;

    return this._client;
  }

  constructor(key, config = {}) {
    this.key = key;
    this.config = config;
  }

  // makes sure that included and excluded operations are valid, like
  // include ['create', 'asd']                       => ['create']
  // exclude ['create', 'read']                      => ['update', 'delete', 'list']
  // include ['create', 'read'] + exclude ['create'] => ['read']
  get operations() {
    const operations = Object.keys(CRUDL.OPERATIONS);

    const {
      include = operations,
      exclude = [],
    } = this.config;

    return operations
      // allows default operations only
      .filter((operation) => include.indexOf(operation) > -1)

      // filters out excluded operations
      .filter((operation) => exclude.indexOf(operation) === -1)

      // returns included operations, like
      // {
      //   create: { multiple: false, identified: false, (...) },
      //   read: { multiple: false, identified: true, (...) },
      //   (...)
      // }
      .reduce((reduced, operation) => ({
        ...reduced,
        [operation]: CRUDL.OPERATIONS[operation],
      }), {});
  }

  // reduces generators to only included CRUDL operations, and also
  // overwrites the default values with custom ones in case they were given
  reduce(extractor, overwrite = {}) {
    const {
      operations,
    } = this;

    return {
      ...Object.keys(operations).reduce((reduced, operation) => ({
        ...reduced,
        [operation]: extractor(operations[operation]),
      }), {}),

      // overwrites default values with custom ones in case they were given
      ...overwrite,
    };
  }

  // returns included operations' keys, like
  // {
  //   create: post,
  //   read: post,
  //   list: posts,
  //   (...)
  // }
  get keys() {
    // snakeCase('archivedPost', { multiple: true }) => archived_posts
    // snakeCase('archivedPost', { multiple: false }) => archived_post
    return this.reduce(
      (operation) => snakeCase(this.key, operation),
      // custom keys
      this.config.keys,
    );
  }

  // returns included operations' endpoints, like
  // {
  //   create: /posts,
  //   update: /posts/:id,
  //   (...)
  // }
  get endpoints() {
    const endpoint = snakeCase(this.key, { multiple: true });

    // generates the pluralized "/posts" endpoints
    // and, for identified operations, adds :id to generate "/posts/:id"
    return this.reduce(
      (operation) => `/${endpoint}${operation.identified ? '/:id' : ''}`,
      // custom endpoints
      this.config.endpoints,
    );
  }

  // returns included operations' methods, like
  // {
  //   create: post,
  //   read: get,
  //   update: put,
  //   (...)
  // }
  get methods() {
    return this.reduce(
      (operation) => CRUDL.METHODS[operation.name],
      // custom methods
      this.config.methods,
    );
  }

  // returns included operations' constants, like
  // {
  //   create: {
  //     start: CRUDL/POST/CREATE/START,
  //     success: CRUDL/POST/CREATE/SUCCESS,
  //     (...)
  //   },
  //   update: {
  //     start: CRUDL/POST/UPDATE/START,
  //     success: CRUDL/POST/UPDATE/SUCCESS,
  //     (...)
  //   },
  //   (...)
  // }
  get constants() {
    const {
      key,
    } = this;

    const constant = (operation, type) => `CRUDL/${snakeCase(key)}/${operation}/${type}`.toUpperCase();

    return this.reduce((operation) => ({
      clean: constant(operation.name, 'clean'),
      start: constant(operation.name, 'start'),
      success: constant(operation.name, 'success'),
      failure: constant(operation.name, 'failure'),
    }));
  }

  // returns included operations' initial data schema, like
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
  get schema() {
    return this.reduce((operation) => ({
      loading: false,
      failure: null,
      [operation.multiple ? 'items' : 'item']: {},
      config: {},
    }));
  }

  // returns included operations' requests, like
  // {
  //   create() { createStartModifier(); createSuccessModifier() || createFailureModifier() },
  //   read() { readStartModifier(); readSuccessModifier() || readFailureModifier() },
  //   (...)
  // }
  get requests() {
    const client = this.config.client || CRUDL.client;

    return this.reduce((operation) => {
      const {
        start,
        success,
        failure,
      } = this.constants[operation.name];

      const endpoint = this.endpoints[operation.name];
      const method = this.methods[operation.name];

      // "executor" is designed to impersonate the default action callback
      // it may or may not be a function,
      // so middle functions may be needed to handle cases in which it is not
      //
      // to illustrate,
      // in Redux, it is dispatch()
      // in Vuex, it is { commit() }
      return (executor, payload) => {
        const {
          // compiles the url with named parameters, like
          // /posts/:id -> /posts/1
          url,
          // removes said named parameters from the sending data
          // so the result url isn't /posts/1?id=1 but /posts/1 instead
          data,
        } = urlCompiler(endpoint, payload);

        // remove crudl's internal request config from the request data
        delete data.crudl;

        const request = {
          method,
          [method === 'get' ? 'params' : 'data']: data,
        };

        return new Promise((resolve, reject) => {
          // calls the start modifier executor to set loading state as true, etc
          executor(start, payload);

          return client(url, request)
            // calls the success modifier executor with the http client's response object
            .then((response) => {
              executor(success, response);
              resolve(response);
            })
            // calls the failure modifier executor with the http client's error object
            .catch((error) => {
              executor(failure, error);
              reject(error);
            });

          // prevents unhandled catch warnings
        }).catch(() => {});
      };
    });
  }

  // returns included operations' cleaners, like
  // {
  //   create() { createCleanModifier() },
  //   read() { readCleanModifier() },
  //   (...)
  // }
  get cleaners() {
    return this.reduce((operation) => (executor) => executor(this.constants[operation.name].clean));
  }

  // returns included operations' modifiers, like
  // {
  //   CRUDL/MODULE_KEY/READ/START: readStartModifier(...),
  //   CRUDL/MODULE_KEY/READ/SUCCESS: readSuccessModifier(...),
  //   (...)
  //   CRUDL/MODULE_KEY/DELETE/START: deleteStartModifier(...),
  //   CRUDL/MODULE_KEY/DELETE/SUCCESS: deleteSuccessModifier(...),
  //   (...)
  // }
  get modifiers() {
    const {
      keys,
      config,
      constants,
      operations,
    } = this;

    const {
      clean,
      start,
      success,
      failure,
    } = config.executors || executors;

    return Object.keys(operations).reduce((reduced, operation) => ({
      ...reduced,

      [constants[operation].clean](data) {
        return clean(keys[operation], operations[operation], config, data);
      },

      [constants[operation].start](data, payload) {
        return start(keys[operation], operations[operation], config, data, payload);
      },

      [constants[operation].success](data, response) {
        return success(keys[operation], operations[operation], config, data, response);
      },

      [constants[operation].failure](data, error) {
        return failure(keys[operation], operations[operation], config, data, error);
      },
    }), {});
  }
}
