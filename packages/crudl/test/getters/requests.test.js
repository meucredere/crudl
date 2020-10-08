import CRUDL from '@/index';

describe('requests', () => {
  describe('generator', () => {
    let post;

    let successClient;
    let failureClient;

    let custom;

    beforeEach(() => {
      post = new CRUDL('post');

      // eslint-disable-next-line prefer-promise-reject-errors
      failureClient = jest.fn(() => Promise.reject('fa1lure'));
      successClient = jest.fn(() => Promise.resolve('succ3ss'));

      custom = jest.fn();
    });

    it('should use the default api client correctly', async () => {
      const spy = jest.spyOn(CRUDL, 'CLIENT');

      await post.requests.list(custom, { foo: 'bar' });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('/posts', { params: { foo: 'bar' }, method: 'get' });

      spy.mockRestore();
    });

    it('should use custom methods correctly', async () => {
      post = new CRUDL('post', { methods: { list: 'put' } });

      const spy = jest.spyOn(CRUDL, 'CLIENT');

      await post.requests.list(custom, { foo: 'bar' });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('/posts', { data: { foo: 'bar' }, method: 'put' });

      spy.mockRestore();
    });

    it('should omit the crudl config when firing the api request', async () => {
      const spy = jest.spyOn(CRUDL, 'CLIENT');

      await post.requests.list(custom, { foo: 'bar', crudl: { boo: 'far' } });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('/posts', { params: { foo: 'bar' }, method: 'get' });

      spy.mockRestore();
    });

    it('should generate a successfull request correctly', async () => {
      post = new CRUDL('post', { client: successClient });

      await post.requests.update(custom, { foo: 'bar', id: 123, crudl: { preserve: true } });

      expect(successClient).toHaveBeenCalledWith('/posts/123', {
        method: 'put',
        data: { foo: 'bar' },
      });

      expect(custom).toHaveBeenCalledWith(post.constants.update.start, { id: 123, foo: 'bar', crudl: { preserve: true } });
      expect(custom).toHaveBeenLastCalledWith(post.constants.update.success, 'succ3ss');
    });

    it('should generate a failed request correctly', async () => {
      post = new CRUDL('post', { client: failureClient, methods: { list: 'put' } });

      try {
        await post.requests.list(custom, { foo: 'bar', crudl: { boo: 'far' } });
      } catch (err) {
        expect(failureClient).toHaveBeenCalledWith('/posts', {
          method: 'put',
          data: { foo: 'bar' },
        });

        expect(custom).toHaveBeenCalledWith(post.constants.list.start, { foo: 'bar', crudl: { boo: 'far' } });
        expect(custom).toHaveBeenLastCalledWith(post.constants.list.failure, 'fa1lure');
      }
    });

    it('should remove url parameters from the payload and parse urls params correctly', async () => {
      post = new CRUDL('post', { endpoints: { read: '/posts/:asd/comments/:qwe' } });

      const spy = jest.spyOn(CRUDL, 'CLIENT');

      await post.requests.read(custom, { foo: 'bar', asd: 1, qwe: 2 });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('/posts/1/comments/2', { params: { foo: 'bar' }, method: 'get' });

      spy.mockRestore();
    });

    it('should work with custom primary keys (identifiers)', async () => {
      post = new CRUDL('post', { identifier: 'foobar' });

      const spy = jest.spyOn(CRUDL, 'CLIENT');

      await post.requests.read(custom, { id: 1, foobar: 'boofar' });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('/posts/boofar', { params: { id: 1 }, method: 'get' });

      spy.mockRestore();
    });
  });

  it('should return all the default requests correctly', () => {
    const post = new CRUDL('post');

    const spy = jest.spyOn(CRUDL, 'CLIENT');

    const createSpy = jest.fn(() => Promise.resolve('createSuccess'));
    const readSpy = jest.fn(() => Promise.resolve('readSuccess'));
    const updateSpy = jest.fn(() => Promise.resolve('updateSuccess'));
    const deleteSpy = jest.fn(() => Promise.resolve('deleteSuccess'));
    const listSpy = jest.fn(() => Promise.resolve('listSuccess'));

    expect(post.requests.create(createSpy, { foo: 'bar' }));
    expect(createSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalledWith(post.constants.create.start, { foo: 'bar' });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith('/posts', { data: { foo: 'bar' }, method: 'post' });

    expect(post.requests.read(readSpy, { id: 1, crudl: { preserve: true } }));
    expect(readSpy).toHaveBeenCalled();
    expect(readSpy).toHaveBeenCalledWith(post.constants.read.start, { id: 1, crudl: { preserve: true } });
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith('/posts/1', { params: {}, method: 'get' });

    expect(post.requests.update(updateSpy, { id: 1, bar: 'foo' }));
    expect(updateSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalledWith(post.constants.update.start, { id: 1, bar: 'foo' });
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenLastCalledWith('/posts/1', { data: { bar: 'foo' }, method: 'put' });

    expect(post.requests.delete(deleteSpy, { id: 1 }));
    expect(deleteSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalledWith(post.constants.delete.start, { id: 1 });
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenLastCalledWith('/posts/1', { data: {}, method: 'delete' });

    expect(post.requests.list(listSpy, { order: 'foo', filter: 'bar' }));
    expect(listSpy).toHaveBeenCalled();
    expect(listSpy).toHaveBeenCalledWith(post.constants.list.start, { order: 'foo', filter: 'bar' });
    expect(spy).toHaveBeenCalledTimes(5);
    expect(spy).toHaveBeenLastCalledWith('/posts', { params: { order: 'foo', filter: 'bar' }, method: 'get' });

    spy.mockRestore();
  });

  describe('global client', () => {
    it('should use CLIENT as default', async () => {
      expect(CRUDL.client).toEqual(CRUDL.CLIENT);

      CRUDL.client = undefined;

      expect(CRUDL.client).toEqual(CRUDL.CLIENT);
    });

    it('should set a global client correctly', async () => {
      const successClient = jest.fn(() => Promise.resolve('succ3ss'));
      const failureClient = jest.fn(() => Promise.reject('fa1lure'));

      let mutation;
      const post = new CRUDL('post');

      mutation = jest.fn();
      CRUDL.client = successClient;

      expect(CRUDL.client).toEqual(successClient);

      await post.requests.list(mutation, { foo: 'bar', crudl: { boo: 'far' } });
      expect(successClient).toHaveBeenCalledTimes(1);
      expect(successClient).toHaveBeenLastCalledWith('/posts', { params: { foo: 'bar' }, method: 'get' });

      expect(mutation).toHaveBeenCalledWith(post.constants.list.start, { foo: 'bar', crudl: { boo: 'far' } });
      expect(mutation).toHaveBeenLastCalledWith(post.constants.list.success, 'succ3ss');

      mutation = jest.fn();
      CRUDL.client = failureClient;

      expect(CRUDL.client).toEqual(failureClient);

      try {
        await post.requests.list(mutation, { foo: 'bar', crudl: { boo: 'far' } });
      } catch (err) {
        expect(successClient).toHaveBeenCalledTimes(1);
        expect(failureClient).toHaveBeenCalledWith('/posts', { method: 'put', data: { foo: 'bar' } });

        expect(mutation).toHaveBeenCalledWith(post.constants.list.start, { foo: 'bar', crudl: { boo: 'far' } });
        expect(mutation).toHaveBeenLastCalledWith(post.constants.list.failure, 'fa1lure');
      }
    });
  });
});
