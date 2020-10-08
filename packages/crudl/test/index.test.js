import CRUDL from '@/index';

describe('crudl/index', () => {
  it('should return all the default generated generators (hehe)', () => {
    const posts = new CRUDL('post', { foo: 'bar' });

    expect(posts.key).toEqual('post');
    expect(posts.config).toEqual({ foo: 'bar' });

    expect(posts.keys).toEqual({
      create: 'post',
      read: 'post',
      update: 'post',
      delete: 'post',
      list: 'posts',
    });

    expect(posts.operations).toEqual({
      create: {
        name: 'create',
        identified: false,
        multiple: false,
      },
      delete: {
        name: 'delete',
        identified: true,
        multiple: false,
      },
      list: {
        name: 'list',
        identified: false,
        multiple: true,
      },
      read: {
        name: 'read',
        identified: true,
        multiple: false,
      },
      update: {
        name: 'update',
        identified: true,
        multiple: false,
      },
    });

    expect(posts.endpoints).toEqual({
      create: '/posts',
      read: '/posts/:id',
      update: '/posts/:id',
      delete: '/posts/:id',
      list: '/posts',
    });

    expect(posts.methods).toEqual({
      create: 'post',
      read: 'get',
      update: 'put',
      delete: 'delete',
      list: 'get',
    });

    expect(posts.schema).toEqual({
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
    });

    expect(posts.constants).toEqual({
      create: {
        clean: 'CRUDL/POST/CREATE/CLEAN',
        failure: 'CRUDL/POST/CREATE/FAILURE',
        start: 'CRUDL/POST/CREATE/START',
        success: 'CRUDL/POST/CREATE/SUCCESS',
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
    });

    // requests, modifiers and cleaners (as everything else) have their own dedicated tests, so... yeah

    expect(posts.modifiers).toEqual({
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
    });

    expect(posts.requests).toEqual({
      create: expect.any(Function), // [Function generatedRequest],
      read: expect.any(Function), // [Function generatedRequest],
      update: expect.any(Function), // [Function generatedRequest],
      delete: expect.any(Function), // [Function generatedRequest],
      list: expect.any(Function), // [Function generatedRequest],
    });

    expect(posts.cleaners).toEqual({
      create: expect.any(Function), // [Function generatedRequest],
      read: expect.any(Function), // [Function generatedRequest],
      update: expect.any(Function), // [Function generatedRequest],
      delete: expect.any(Function), // [Function generatedRequest],
      list: expect.any(Function), // [Function generatedRequest],
    });
  });
});
