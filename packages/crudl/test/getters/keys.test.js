import CRUDL from '@/index';

describe('keys', () => {
  it('should return keys for all default operations', () => {
    expect(new CRUDL('foo_bar').keys).toEqual({
      create: 'foo_bar',
      read: 'foo_bar',
      update: 'foo_bar',
      delete: 'foo_bar',
      list: 'foo_bars',
    });
  });

  it('should return keys for included operations only', () => {
    expect(new CRUDL('foo_bar', {
      include: ['create', 'list'],
    }).keys).toEqual({
      create: 'foo_bar',
      list: 'foo_bars',
    });
  });

  it('should replace default keys correctly', () => {
    expect(new CRUDL('foo_bar', {
      include: ['create', 'list'],
      keys: {
        create: 'fooCustomBar',
      },
    }).keys).toEqual({
      create: 'fooCustomBar',
      list: 'foo_bars',
    });
  });

  it('should preserve empty keys (so no wrapping request results) correctly', () => {
    expect(new CRUDL('foo_bar', {
      keys: {
        create: 'whatever',
        update: 'whatevs',
      },
    }).keys).toEqual({
      create: 'whatever',
      read: 'foo_bar',
      update: 'whatevs',
      delete: 'foo_bar',
      list: 'foo_bars',
    });
  });
});
