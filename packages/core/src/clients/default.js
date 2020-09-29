/* eslint-disable import/prefer-default-export */

export function defaultClient() {
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error('No HTTP client was provided to crudl. Using Promise.resolve() for mocking purposes.');
  }

  return Promise.resolve();
}
