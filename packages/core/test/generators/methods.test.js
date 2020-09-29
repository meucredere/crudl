import generator from '@/generators/methods';

describe('generators/methods', () => {
  it('should return all the default methods', () => {
    expect(generator()).toEqual({
      create: 'post',
      read: 'get',
      update: 'put',
      delete: 'delete',
      list: 'get',
    });
  });

  it('should overwrite default methods correctly', () => {
    expect(generator(undefined, {
      methods: {
        update: 'patch',
        list: 'post',
        delete: 'put',
      },
    })).toEqual({
      create: 'post',
      read: 'get',
      update: 'patch',
      delete: 'put',
      list: 'post',
    });
  });

  it('should return only included methods correctly', () => {
    expect(generator('someItem', {
      include: ['read'],
    })).toEqual({
      read: 'get',
    });
  });
});
