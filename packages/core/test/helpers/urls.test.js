import urlCompiler from '@/helpers/urls';

describe('helpers/urls', () => {
  it('should compile urls correctly', () => {
    expect(urlCompiler().url).toEqual('');

    expect(urlCompiler('/foo').url).toEqual('/foo');
    expect(urlCompiler('/foo/bar', {}).url).toEqual('/foo/bar');
    expect(urlCompiler('/foo/:bar', { bar: 321, boo: 123 }).url).toEqual('/foo/321');
    expect(urlCompiler('/:foo/bar', { foo: 123 }).url).toEqual('/123/bar');
    expect(urlCompiler('/foo/:bar/far/:boo', { bar: 123, boo: 456 }).url).toEqual('/foo/123/far/456');
  });

  it('should remove name parameters correctly', () => {
    expect(urlCompiler('/foo/:bar', { bar: 321 }).striped).toEqual({});
    expect(urlCompiler('/foo/:bar', { bar: 321, boo: 123 }).striped).toEqual({ boo: 123 });
    expect(urlCompiler('/foo/:bar/far/:boo', { foo: 12, bar: 34, far: 56, boo: 78 }).striped).toEqual({ foo: 12, far: 56 });
  });

  it('should ignore not given or invalid parameters (kinda for easier debugging purposes on v0.0.1)', () => {
    expect(urlCompiler('/:foo/bar').url).toEqual('/:foo/bar');
    expect(urlCompiler('/:foo/bar', { bar: 123 }).url).toEqual('/:foo/bar');
    expect(urlCompiler('/:foo:bar', { foo: 123, bar: 456 }).url).toEqual('/:foo:bar');
  });
});
