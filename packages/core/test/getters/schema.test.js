import CRUDL from '@/index';

describe('generators/endpoints', () => {
  it('should return the initial data for all operations', () => {
    expect(new CRUDL('post').schema).toEqual({
      create: {
        loading: false,
        failure: null,
        item: {},
        config: {},
      },
      read: {
        loading: false,
        failure: null,
        item: {},
        config: {},
      },
      update: {
        loading: false,
        failure: null,
        item: {},
        config: {},
      },
      delete: {
        loading: false,
        failure: null,
        item: {},
        config: {},
      },
      list: {
        loading: false,
        failure: null,
        items: {},
        config: {},
      },
    });
  });

  it('should return initial data for included operations only', () => {
    expect(new CRUDL('post', {
      include: ['update', 'list'],
    }).schema).toEqual({
      update: {
        loading: false,
        failure: null,
        item: {},
        config: {},
      },
      list: {
        loading: false,
        failure: null,
        items: {},
        config: {},
      },
    });
  });
});
