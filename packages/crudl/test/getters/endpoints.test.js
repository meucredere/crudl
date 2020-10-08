import CRUDL from '@/index';

describe('endpoints', () => {
  it('should return all the default endpoints', () => {
    expect(new CRUDL('post').endpoints).toEqual({
      create: '/posts',
      read: '/posts/:id',
      update: '/posts/:id',
      delete: '/posts/:id',
      list: '/posts',
    });
  });

  it('should overwrite default endpoints correctly', () => {
    expect(new CRUDL('post', {
      endpoints: {
        list: '/hello-world',
        delete: '/deactivateNow',
      },
    }).endpoints).toEqual({
      create: '/posts',
      read: '/posts/:id',
      update: '/posts/:id',
      delete: '/deactivateNow',
      list: '/hello-world',
    });
  });

  it('should return endpoints for included operations only', () => {
    expect(new CRUDL('post', {
      include: ['read', 'list'],
    }).endpoints).toEqual({
      read: '/posts/:id',
      list: '/posts',
    });
  });
});
