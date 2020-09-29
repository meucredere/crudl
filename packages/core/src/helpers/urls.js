export default function urlCompiler(url = '', params = {}) {
  const striped = { ...params };

  function replace(param) {
    const match = param.match(/^:(.*?)(?=\?|#|$)/);

    if (match) {
      const key = match[0].replace(/^:/, '');

      delete striped[key];
      return params[key] || param;
    }

    return param;
  }

  return {
    url: url.split('/').map(replace).join('/'),
    striped,
  };
}
