import keysGenerator, {
  pluralizeAndSnakeCase,
  snakeCase,
} from '@/generators/keys';

describe('generators/keys', () => {
  describe('camelCase', () => {
    it('should pluralize, lowercase and snakecase words correctly', () => {
      expect(pluralizeAndSnakeCase('foobar')).toEqual('foobars');
      expect(snakeCase('foobar', { multiple: true })).toEqual('foobars');

      expect(pluralizeAndSnakeCase('foo-bar')).toEqual('foo_bars');
      expect(snakeCase('foo-bar', { multiple: true })).toEqual('foo_bars');

      expect(pluralizeAndSnakeCase('foo-Bar')).toEqual('foo_bars');
      expect(snakeCase('foo-Bar', { multiple: true })).toEqual('foo_bars');

      expect(pluralizeAndSnakeCase('foo_bar')).toEqual('foo_bars');
      expect(snakeCase('foo_bar', { multiple: true })).toEqual('foo_bars');

      expect(pluralizeAndSnakeCase('Foo_Bar')).toEqual('foo_bars');
      expect(snakeCase('Foo_Bar', { multiple: true })).toEqual('foo_bars');

      expect(pluralizeAndSnakeCase('Foo_-___Bar')).toEqual('foo_bars');
      expect(snakeCase('Foo_-___Bar', { multiple: true })).toEqual('foo_bars');

      expect(pluralizeAndSnakeCase('FooBar')).toEqual('foo_bars');
      expect(snakeCase('FooBar', { multiple: true })).toEqual('foo_bars');

      expect(pluralizeAndSnakeCase('fooBar')).toEqual('foo_bars');
      expect(snakeCase('fooBar', { multiple: true })).toEqual('foo_bars');
    });

    it('should singularize (by default), lowercase and snakecase words correctly', () => {
      expect(snakeCase('foobar')).toEqual('foobar');
    });
  });

  it('should return keys for all default operations', () => {
    expect(keysGenerator('foo_bar')).toEqual({
      create: 'foo_bar',
      read: 'foo_bar',
      update: 'foo_bar',
      delete: 'foo_bar',
      list: 'foo_bars',
    });
  });

  it('should only return keys for included operations', () => {
    expect(keysGenerator('foo_bar', {
      include: ['create', 'list'],
    })).toEqual({
      create: 'foo_bar',
      list: 'foo_bars',
    });
  });

  it('should replace default keys correctly', () => {
    expect(keysGenerator('foo_bar', {
      include: ['create', 'list'],
      keys: {
        create: 'fooCustomBar',
      },
    })).toEqual({
      create: 'fooCustomBar',
      list: 'foo_bars',
    });
  });

  it('should preserve empty keys (so no wrapping request results) correctly', () => {
    expect(keysGenerator('foo_bar', {
      keys: {
        create: false,
        update: false,
      },
    })).toEqual({
      create: false,
      read: 'foo_bar',
      update: false,
      delete: 'foo_bar',
      list: 'foo_bars',
    });
  });
});
