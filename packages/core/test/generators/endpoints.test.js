import generator from '@/generators/endpoints';

describe('generators/endpoints', () => {
  it('should return all the default endpoints', () => {
    expect(generator('someItem')).toEqual({
      create: '/some_items',
      read: '/some_items/:id',
      update: '/some_items/:id',
      delete: '/some_items/:id',
      list: '/some_items',
    });
  });

  it('should overwrite default endpoints correctly', () => {
    expect(generator('someItem', {
      endpoints: {
        list: '/hello-world',
        delete: '/deactivateNow',
      },
    })).toEqual({
      create: '/some_items',
      read: '/some_items/:id',
      update: '/some_items/:id',
      delete: '/deactivateNow',
      list: '/hello-world',
    });
  });

  it('should return only included endpoints correctly', () => {
    expect(generator('someItem', {
      include: ['read', 'list'],
    })).toEqual({
      read: '/some_items/:id',
      list: '/some_items',
    });
  });
});
