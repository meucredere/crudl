export default function urlCompiler(url = '', params = {}) {
  const data = { ...params };

  function replace(param) {
    const match = param.match(/^:(.*?)(?=\?|#|$)/);

    if (match) {
      const key = match[0].replace(/^:/, '');

      delete data[key];
      return params[key] || param;
    }

    return param;
  }

  return {
    url: url.split('/').map(replace).join('/'),
    data,
  };
}
