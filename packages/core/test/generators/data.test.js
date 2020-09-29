import dataGenerator from '@/generators/data';

describe('generators/endpoints', () => {
  it('should return the initial data for all operations', () => {
    expect(dataGenerator('post')).toEqual({
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

  it('should only return initial data for included operations', () => {
    expect(dataGenerator('post', {
      include: ['update', 'list'],
    })).toEqual({
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
