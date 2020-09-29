import methodsGenerator from '@/generators/methods';

describe('generators/methods', () => {
  it('should return all the default methods', () => {
    expect(methodsGenerator()).toEqual({
      create: 'post',
      read: 'get',
      update: 'put',
      delete: 'delete',
      list: 'get',
    });
  });

  it('should overwrite default methods correctly', () => {
    expect(methodsGenerator(undefined, {
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

  it('should only return methods for included operations', () => {
    expect(methodsGenerator('someItem', {
      include: ['read'],
    })).toEqual({
      read: 'get',
    });
  });
});
