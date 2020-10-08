import CRUDL from '@/index';

import * as executors from '@/executors/index';

describe('modifiers', () => {
  let posts;

  beforeEach(() => {
    posts = new CRUDL('post');
  });

  it('should return all the default modifiers correctly', () => {
    expect(Object.keys(posts.modifiers)).toEqual(
      Object.values(posts.constants.create)
        .concat(Object.values(posts.constants.read))
        .concat(Object.values(posts.constants.update))
        .concat(Object.values(posts.constants.delete))
        .concat(Object.values(posts.constants.list)),
    );
  });

  it('should return modifiers for included operations only', () => {
    posts = new CRUDL('post', { include: ['create', 'update'] });

    expect(Object.keys(posts.modifiers)).toEqual(
      Object.values(posts.constants.create)
        .concat(Object.values(posts.constants.update)),
    );
  });

  it('should call the default modifier executors correctly', () => {
    const data = { list: { items: { 1: { a: 'b' } }, loading: false, failure: null } };
    const response = { data: { posts: [{ id: 1, a: 'b' }] } };
    const error = new Error('foo bar');

    const cleanSpy = jest.spyOn(executors, 'clean');
    const startSpy = jest.spyOn(executors, 'start');
    const successSpy = jest.spyOn(executors, 'success');
    const failureSpy = jest.spyOn(executors, 'failure');

    posts.modifiers[posts.constants.list.clean](data);
    expect(cleanSpy).toHaveBeenLastCalledWith(posts.keys.list, posts.operations.list, posts.config, data);

    posts.modifiers[posts.constants.list.start](data, response);
    expect(startSpy).toHaveBeenLastCalledWith(posts.keys.list, posts.operations.list, posts.config, data, response);

    posts.modifiers[posts.constants.list.success](data, response);
    expect(successSpy).toHaveBeenLastCalledWith(posts.keys.list, posts.operations.list, posts.config, data, response);

    posts.modifiers[posts.constants.list.failure](data, error);
    expect(failureSpy).toHaveBeenLastCalledWith(posts.keys.list, posts.operations.list, posts.config, data, error);
  });

  it('should call custom modifier executors correctly', () => {
    const customExecutors = {
      clean: jest.fn(),
      start: jest.fn(),
      success: jest.fn(),
      failure: jest.fn(),
    };

    posts = new CRUDL('post', { executors: customExecutors });

    const data = { list: { items: { 1: { a: 'b' } }, loading: false, failure: null } };
    const response = { data: { posts: [{ id: 1, a: 'b' }] } };
    const error = new Error('foo bar');

    posts.modifiers[posts.constants.list.clean](data);
    expect(customExecutors.clean).toHaveBeenLastCalledWith(posts.keys.list, posts.operations.list, posts.config, data);

    posts.modifiers[posts.constants.list.start](data, response);
    expect(customExecutors.start).toHaveBeenLastCalledWith(posts.keys.list, posts.operations.list, posts.config, data, response);

    posts.modifiers[posts.constants.list.success](data, response);
    expect(customExecutors.success).toHaveBeenLastCalledWith(posts.keys.list, posts.operations.list, posts.config, data, response);

    posts.modifiers[posts.constants.list.failure](data, error);
    expect(customExecutors.failure).toHaveBeenLastCalledWith(posts.keys.list, posts.operations.list, posts.config, data, error);
  });

  it('should handle responses with no keys', () => {
    let result;

    posts = new CRUDL('post', {
      keys: {
        list: '',
        read: '',
      },
    });

    const data = {
      list: { items: {}, loading: false, failure: null, config: {} },
      read: { item: {}, loading: false, failure: null, config: {} }
    };

    result = posts.modifiers[posts.constants.list.success](data, { data: [{ id: 123 }] });
    expect(result.list).toEqual({ items: { 123: { id: 123 } }, loading: false, failure: null, config: {} });

    result = posts.modifiers[posts.constants.read.success](data, { data: { id: 123 } });
    expect(result.read).toEqual({ item: { id: 123 }, loading: false, failure: null, config: {} });
  });

  it('should not modify the original data when the "spread" config is present', () => {
    let data;
    let result;
    const response = { data: { posts: [{ id: 1, a: 'b' }] } };

    posts = new CRUDL('post');
    data = { list: { items: {}, loading: false, failure: null, config: {} } };
    result = posts.modifiers[posts.constants.list.success](data, response);
    expect(result).toEqual({ list: { items: { 1: { id: 1, a: 'b' } }, loading: false, failure: null, config: {} } });
    expect(data).toEqual({ list: { items: { 1: { id: 1, a: 'b' } }, loading: false, failure: null, config: {} } });

    posts = new CRUDL('post', { spread: true });
    data = { list: { items: {}, loading: false, failure: null, config: {} } };
    result = posts.modifiers[posts.constants.list.success](data, response);
    expect(result).toEqual({ list: { items: { 1: { id: 1, a: 'b' } }, loading: false, failure: null, config: {} } });
    expect(data).toEqual({ list: { items: {}, loading: false, failure: null, config: {} } });
  });
});
