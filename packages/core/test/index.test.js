import crudl from '@/index';

describe('crudl/index', () => {
  it('should return all the default generated generators (hehe)', () => {
    const posts = crudl('post');

    expect(posts).toEqual({
      keys: {
        create: 'post',
        delete: 'post',
        list: 'posts',
        read: 'post',
        update: 'post',
      },
      operations: {
        create: {
          identified: false,
          method: 'post',
          multiple: false,
        },
        delete: {
          identified: true,
          method: 'delete',
          multiple: false,
        },
        list: {
          identified: false,
          method: 'get',
          multiple: true,
        },
        read: {
          identified: true,
          method: 'get',
          multiple: false,
        },
        update: {
          identified: true,
          method: 'put',
          multiple: false,
        },
      },
      endpoints: {
        create: '/posts',
        delete: '/posts/:id',
        list: '/posts',
        read: '/posts/:id',
        update: '/posts/:id',
      },
      methods: {
        create: 'post',
        delete: 'delete',
        list: 'get',
        read: 'get',
        update: 'put',
      },
      data: {
        create: {
          loading: false,
          failure: null,
          config: {},
          item: {},
        },
        read: {
          loading: false,
          failure: null,
          config: {},
          item: {},
        },
        update: {
          loading: false,
          failure: null,
          config: {},
          item: {},
        },
        delete: {
          loading: false,
          failure: null,
          config: {},
          item: {},
        },
        list: {
          loading: false,
          failure: null,
          config: {},
          items: {},
        },
      },
      constants: {
        create: {
          clean: 'CRUDL/POST/CREATE/CLEAN',
          failure: 'CRUDL/POST/CREATE/FAILURE',
          start: 'CRUDL/POST/CREATE/START',
          success: 'CRUDL/POST/CREATE/SUCCESS',
        },
        delete: {
          clean: 'CRUDL/POST/DELETE/CLEAN',
          failure: 'CRUDL/POST/DELETE/FAILURE',
          start: 'CRUDL/POST/DELETE/START',
          success: 'CRUDL/POST/DELETE/SUCCESS',
        },
        list: {
          clean: 'CRUDL/POST/LIST/CLEAN',
          failure: 'CRUDL/POST/LIST/FAILURE',
          start: 'CRUDL/POST/LIST/START',
          success: 'CRUDL/POST/LIST/SUCCESS',
        },
        read: {
          clean: 'CRUDL/POST/READ/CLEAN',
          failure: 'CRUDL/POST/READ/FAILURE',
          start: 'CRUDL/POST/READ/START',
          success: 'CRUDL/POST/READ/SUCCESS',
        },
        update: {
          clean: 'CRUDL/POST/UPDATE/CLEAN',
          failure: 'CRUDL/POST/UPDATE/FAILURE',
          start: 'CRUDL/POST/UPDATE/START',
          success: 'CRUDL/POST/UPDATE/SUCCESS',
        },
      },

      // requests and modifiers (as everything else) have their own dedicated tests, so... yeah

      modifiers: {
        'CRUDL/POST/CREATE/CLEAN': expect.any(Function), // [Function CRUDL/POST/CREATE/CLEAN],
        'CRUDL/POST/CREATE/FAILURE': expect.any(Function), // [Function CRUDL/POST/CREATE/FAILURE],
        'CRUDL/POST/CREATE/START': expect.any(Function), // [Function CRUDL/POST/CREATE/START],
        'CRUDL/POST/CREATE/SUCCESS': expect.any(Function), // [Function CRUDL/POST/CREATE/SUCCESS],
        'CRUDL/POST/READ/CLEAN': expect.any(Function), // [Function CRUDL/POST/READ/CLEAN],
        'CRUDL/POST/READ/FAILURE': expect.any(Function), // [Function CRUDL/POST/READ/FAILURE],
        'CRUDL/POST/READ/START': expect.any(Function), // [Function CRUDL/POST/READ/START],
        'CRUDL/POST/READ/SUCCESS': expect.any(Function), // [Function CRUDL/POST/READ/SUCCESS],
        'CRUDL/POST/UPDATE/CLEAN': expect.any(Function), // [Function CRUDL/POST/UPDATE/CLEAN],
        'CRUDL/POST/UPDATE/FAILURE': expect.any(Function), // [Function CRUDL/POST/UPDATE/FAILURE],
        'CRUDL/POST/UPDATE/START': expect.any(Function), // [Function CRUDL/POST/UPDATE/START],
        'CRUDL/POST/UPDATE/SUCCESS': expect.any(Function), // [Function CRUDL/POST/UPDATE/SUCCESS],
        'CRUDL/POST/DELETE/CLEAN': expect.any(Function), // [Function CRUDL/POST/DELETE/CLEAN],
        'CRUDL/POST/DELETE/FAILURE': expect.any(Function), // [Function CRUDL/POST/DELETE/FAILURE],
        'CRUDL/POST/DELETE/START': expect.any(Function), // [Function CRUDL/POST/DELETE/START],
        'CRUDL/POST/DELETE/SUCCESS': expect.any(Function), // [Function CRUDL/POST/DELETE/SUCCESS],
        'CRUDL/POST/LIST/CLEAN': expect.any(Function), // [Function CRUDL/POST/LIST/CLEAN],
        'CRUDL/POST/LIST/FAILURE': expect.any(Function), // [Function CRUDL/POST/LIST/FAILURE],
        'CRUDL/POST/LIST/START': expect.any(Function), // [Function CRUDL/POST/LIST/START],
        'CRUDL/POST/LIST/SUCCESS': expect.any(Function), // [Function CRUDL/POST/LIST/SUCCESS],
      },
      requests: {
        create: expect.any(Function), // [Function generatedRequest],
        delete: expect.any(Function), // [Function generatedRequest],
        list: expect.any(Function), // [Function generatedRequest],
        read: expect.any(Function), // [Function generatedRequest],
        update: expect.any(Function), // [Function generatedRequest],
      },
    });
  });
});
