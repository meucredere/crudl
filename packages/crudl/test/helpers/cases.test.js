import snakeCase from '@/helpers/cases';

describe('helpers/cases', () => {
  it('should pluralize, lowercase and snakecase words correctly', () => {
    expect(snakeCase('foobar', { multiple: true })).toEqual('foobars');
    expect(snakeCase('fooBar', { multiple: true })).toEqual('foo_bars');
    expect(snakeCase('fooBBar', { multiple: true })).toEqual('foo_b_bars');
    expect(snakeCase('FooBar', { multiple: true })).toEqual('foo_bars');
  });

  it('should singularize (by default), lowercase and snakecase words correctly', () => {
    expect(snakeCase('fooBar')).toEqual('foo_bar');
    expect(snakeCase('foobar')).toEqual('foobar');
  });
});
