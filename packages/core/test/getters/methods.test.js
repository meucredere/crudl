import CRUDL from '@/index';

describe('methods', () => {
  it('should return all the default methods', () => {
    expect(new CRUDL('post').methods).toEqual({
      create: 'post',
      read: 'get',
      update: 'put',
      delete: 'delete',
      list: 'get',
    });
  });

  it('should have all the default CRUDL operations', () => {
    expect(CRUDL.METHODS.create).toEqual('post');
    expect(CRUDL.METHODS.read).toEqual('get');
    expect(CRUDL.METHODS.update).toEqual('put');
    expect(CRUDL.METHODS.delete).toEqual('delete');
    expect(CRUDL.METHODS.list).toEqual('get');
  });

  it('should overwrite default methods correctly', () => {
    expect(new CRUDL('post', {
      methods: {
        update: 'patch',
        list: 'post',
        delete: 'put',
      },
    }).methods).toEqual({
      create: 'post',
      read: 'get',
      update: 'patch',
      delete: 'put',
      list: 'post',
    });
  });

  it('should return methods for included operations only', () => {
    expect(new CRUDL('post', {
      include: ['read'],
    }).methods).toEqual({
      read: 'get',
    });
  });
});
