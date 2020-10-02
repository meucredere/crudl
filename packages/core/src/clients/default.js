/* eslint-disable import/prefer-default-export */

export function defaultClient() {
  // eslint-disable-next-line no-console
  console.log('No HTTP client was provided to crudl. Using Promise.resolve() for mocking purposes.');

  return Promise.resolve();
}
