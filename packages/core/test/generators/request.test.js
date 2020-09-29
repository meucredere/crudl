import constantsGenerator from '@/generators/constants';

import * as client from '@/clients/default';

import generator, {
  requestGenerator,
} from '@/generators/requests';

describe('generators/requests', () => {
  describe('requestGenerator', () => {
    const constants = constantsGenerator('post');

    let successClient;
    let failureClient;

    let custom;

    beforeEach(() => {
      // eslint-disable-next-line prefer-promise-reject-errors
      failureClient = jest.fn(() => Promise.reject('fa1lure'));
      successClient = jest.fn(() => Promise.resolve('succ3ss'));

      custom = jest.fn();
    });

    it('should use the default api client correctly', async () => {
      const spy = jest.spyOn(client, 'defaultClient');

      const request = requestGenerator('post', 'list', 'put', '/posts', constants.list);

      await request(custom, { foo: 'bar' });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('/posts', { data: { foo: 'bar' }, method: 'put' });

      spy.mockRestore();
    });

    it('should generate a successfull request correctly', async () => {
      const request = requestGenerator('post', 'list', 'put', '/posts', constants.list, {
        client: successClient,
      });

      await request(custom, { foo: 'bar' });

      expect(successClient).toHaveBeenCalledWith('/posts', {
        method: 'put',
        data: { foo: 'bar' },
      });

      expect(custom).toHaveBeenCalledWith(constants.list.start);
      expect(custom).toHaveBeenLastCalledWith(constants.list.success, 'succ3ss');
    });

    it('should generate a failed request correctly', async () => {
      const request = requestGenerator('post', 'list', 'put', '/posts', constants.list, {
        client: failureClient,
      });

      try {
        await request(custom, { foo: 'bar' });
      } catch (err) {
        expect(failureClient).toHaveBeenCalledWith('/posts', {
          method: 'put',
          data: { foo: 'bar' },
        });

        expect(custom).toHaveBeenCalledWith(constants.list.start);
        expect(custom).toHaveBeenLastCalledWith(constants.list.failure, 'fa1lure');
      }
    });

    it('should remove url parameters from the payload and parse urls params correctly', async () => {
      const spy = jest.spyOn(client, 'defaultClient');

      const request = requestGenerator('post', 'read', 'get', '/posts/:asd/comments/:qwe', constants.read);

      await request(custom, { foo: 'bar', asd: 1, qwe: 2 });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('/posts/1/comments/2', { params: { foo: 'bar' }, method: 'get' });

      spy.mockRestore();
    });
  });

  it('should return all the default requests correctly', () => {
    const spy = jest.spyOn(client, 'defaultClient');
    const constants = constantsGenerator('post');

    const createSpy = jest.fn(() => Promise.resolve('createSuccess'));
    const readSpy = jest.fn(() => Promise.resolve('readSuccess'));
    const updateSpy = jest.fn(() => Promise.resolve('updateSuccess'));
    const deleteSpy = jest.fn(() => Promise.resolve('deleteSuccess'));
    const listSpy = jest.fn(() => Promise.resolve('listSuccess'));

    expect(generator('post').create(createSpy, { foo: 'bar' }));
    expect(createSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalledWith(constants.create.start);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith('/posts', { data: { foo: 'bar' }, method: 'post' });

    expect(generator('post').read(readSpy, { id: 1 }));
    expect(readSpy).toHaveBeenCalled();
    expect(readSpy).toHaveBeenCalledWith(constants.read.start);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith('/posts/1', { params: {}, method: 'get' });

    expect(generator('post').update(updateSpy, { id: 1, bar: 'foo' }));
    expect(updateSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalledWith(constants.update.start);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenLastCalledWith('/posts/1', { data: { bar: 'foo' }, method: 'put' });

    expect(generator('post').delete(deleteSpy, { id: 1 }));
    expect(deleteSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalledWith(constants.delete.start);
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenLastCalledWith('/posts/1', { data: {}, method: 'delete' });

    expect(generator('post').list(listSpy, { order: 'foo', filter: 'bar' }));
    expect(listSpy).toHaveBeenCalled();
    expect(listSpy).toHaveBeenCalledWith(constants.list.start);
    expect(spy).toHaveBeenCalledTimes(5);
    expect(spy).toHaveBeenLastCalledWith('/posts', { params: { order: 'foo', filter: 'bar' }, method: 'get' });

    spy.mockRestore();
  });
});
