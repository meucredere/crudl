import CRUDL from '@/index';

describe('constants', () => {
  expect(new CRUDL('fooBar').constants).toEqual({
    create: {
      clean: 'CRUDL/FOO_BAR/CREATE/CLEAN',
      start: 'CRUDL/FOO_BAR/CREATE/START',
      success: 'CRUDL/FOO_BAR/CREATE/SUCCESS',
      failure: 'CRUDL/FOO_BAR/CREATE/FAILURE',
    },
    read: {
      clean: 'CRUDL/FOO_BAR/READ/CLEAN',
      start: 'CRUDL/FOO_BAR/READ/START',
      success: 'CRUDL/FOO_BAR/READ/SUCCESS',
      failure: 'CRUDL/FOO_BAR/READ/FAILURE',
    },
    update: {
      clean: 'CRUDL/FOO_BAR/UPDATE/CLEAN',
      start: 'CRUDL/FOO_BAR/UPDATE/START',
      success: 'CRUDL/FOO_BAR/UPDATE/SUCCESS',
      failure: 'CRUDL/FOO_BAR/UPDATE/FAILURE',
    },
    delete: {
      clean: 'CRUDL/FOO_BAR/DELETE/CLEAN',
      start: 'CRUDL/FOO_BAR/DELETE/START',
      success: 'CRUDL/FOO_BAR/DELETE/SUCCESS',
      failure: 'CRUDL/FOO_BAR/DELETE/FAILURE',
    },
    list: {
      clean: 'CRUDL/FOO_BAR/LIST/CLEAN',
      start: 'CRUDL/FOO_BAR/LIST/START',
      success: 'CRUDL/FOO_BAR/LIST/SUCCESS',
      failure: 'CRUDL/FOO_BAR/LIST/FAILURE',
    },
  });
});

it('should return constants for included operations only', () => {
  expect(new CRUDL('post', {
    include: ['read'],
  }).constants).toEqual({
    read: {
      clean: 'CRUDL/POST/READ/CLEAN',
      start: 'CRUDL/POST/READ/START',
      success: 'CRUDL/POST/READ/SUCCESS',
      failure: 'CRUDL/POST/READ/FAILURE',
    },
  });
});
