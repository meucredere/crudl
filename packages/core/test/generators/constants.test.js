import generator, { constantGenerator } from '@/generators/constants';

describe('generators/constants', () => {
  describe('constantsGenerator', () => {
    expect(constantGenerator('asdFoo', 'list', 'success')).toEqual('CRUDL/ASDFOO/LIST/SUCCESS');
  });

  it('should return all the default constants correctly', () => {
    expect(generator('fooBar')).toEqual({
      create: {
        clean: 'CRUDL/FOOBAR/CREATE/CLEAN',
        start: 'CRUDL/FOOBAR/CREATE/START',
        success: 'CRUDL/FOOBAR/CREATE/SUCCESS',
        failure: 'CRUDL/FOOBAR/CREATE/FAILURE',
      },
      read: {
        clean: 'CRUDL/FOOBAR/READ/CLEAN',
        start: 'CRUDL/FOOBAR/READ/START',
        success: 'CRUDL/FOOBAR/READ/SUCCESS',
        failure: 'CRUDL/FOOBAR/READ/FAILURE',
      },
      update: {
        clean: 'CRUDL/FOOBAR/UPDATE/CLEAN',
        start: 'CRUDL/FOOBAR/UPDATE/START',
        success: 'CRUDL/FOOBAR/UPDATE/SUCCESS',
        failure: 'CRUDL/FOOBAR/UPDATE/FAILURE',
      },
      delete: {
        clean: 'CRUDL/FOOBAR/DELETE/CLEAN',
        start: 'CRUDL/FOOBAR/DELETE/START',
        success: 'CRUDL/FOOBAR/DELETE/SUCCESS',
        failure: 'CRUDL/FOOBAR/DELETE/FAILURE',
      },
      list: {
        clean: 'CRUDL/FOOBAR/LIST/CLEAN',
        start: 'CRUDL/FOOBAR/LIST/START',
        success: 'CRUDL/FOOBAR/LIST/SUCCESS',
        failure: 'CRUDL/FOOBAR/LIST/FAILURE',
      },
    });
  });

  it('should return only included constants correctly', () => {
    expect(generator('hello', {
      include: ['read'],
    })).toEqual({
      read: {
        clean: 'CRUDL/HELLO/READ/CLEAN',
        start: 'CRUDL/HELLO/READ/START',
        success: 'CRUDL/HELLO/READ/SUCCESS',
        failure: 'CRUDL/HELLO/READ/FAILURE',
      },
    });
  });
});
