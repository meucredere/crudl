import CRUDL from '@/index';

describe('operations', () => {
  it('should filter operations correctly', () => {
    expect(Object.keys(new CRUDL('post').operations)).toEqual(Object.keys(CRUDL.OPERATIONS));
    expect(Object.keys(new CRUDL('post', { include: ['create'] }).operations)).toEqual(['create']);
    expect(Object.keys(new CRUDL('post', { include: ['create', 'read'] }).operations)).toEqual(['create', 'read']);
    expect(Object.keys(new CRUDL('post', { include: ['create', 'read'], exclude: 'create' }).operations)).toEqual(['read']);
  });

  it('should have all the default CRUDL operations', () => {
    expect(Object.keys(CRUDL.OPERATIONS)).toEqual(['create', 'read', 'update', 'delete', 'list']);

    expect(CRUDL.OPERATIONS.create.multiple).toEqual(false);
    expect(CRUDL.OPERATIONS.read.multiple).toEqual(false);
    expect(CRUDL.OPERATIONS.update.multiple).toEqual(false);
    expect(CRUDL.OPERATIONS.delete.multiple).toEqual(false);
    expect(CRUDL.OPERATIONS.list.multiple).toEqual(true);

    expect(CRUDL.OPERATIONS.create.identified).toEqual(false);
    expect(CRUDL.OPERATIONS.read.identified).toEqual(true);
    expect(CRUDL.OPERATIONS.update.identified).toEqual(true);
    expect(CRUDL.OPERATIONS.delete.identified).toEqual(true);
    expect(CRUDL.OPERATIONS.list.identified).toEqual(false);
  });

  it('should return all the operations when no "include" or "exclude" is used', () => {
    expect(new CRUDL('post').operations).toEqual(CRUDL.OPERATIONS);
  });

  it('should return operations correctly when using "include" only', () => {
    expect(new CRUDL('post', {
      include: ['create'],
    }).operations).toEqual({ create: CRUDL.OPERATIONS.create });

    expect(new CRUDL('post', {
      include: ['create', 'asd'],
    }).operations).toEqual({ create: CRUDL.OPERATIONS.create });

    expect(new CRUDL('post', {
      include: ['create', 'update'],
    }).operations).toEqual({ create: CRUDL.OPERATIONS.create, update: CRUDL.OPERATIONS.update });
  });

  it('should return operations correctly when using "exclude" only', () => {
    expect(new CRUDL('post', {
      exclude: ['create', 'update'],
    }).operations).toEqual({
      read: CRUDL.OPERATIONS.read,
      delete: CRUDL.OPERATIONS.delete,
      list: CRUDL.OPERATIONS.list,
    });

    expect(new CRUDL('post', {
      exclude: ['create', 'asd', 'delete'],
    }).operations).toEqual({
      read: CRUDL.OPERATIONS.read,
      update: CRUDL.OPERATIONS.update,
      list: CRUDL.OPERATIONS.list,
    });

    expect(new CRUDL('post', {
      exclude: ['create', 'update'],
    }).operations).toEqual({
      read: CRUDL.OPERATIONS.read,
      delete: CRUDL.OPERATIONS.delete,
      list: CRUDL.OPERATIONS.list,
    });
  });

  it('should return operations correctly when using both "include" and "exclude"', () => {
    expect(new CRUDL('post', {
      include: ['create', 'read'],
      exclude: ['create'],
    }).operations).toEqual({ read: CRUDL.OPERATIONS.read });

    expect(new CRUDL('post', {
      include: ['create', 'update', 'asd'],
      exclude: ['update', 'asd'],
    }).operations).toEqual({ create: CRUDL.OPERATIONS.create });

    expect(new CRUDL('post', {
      include: ['create', 'update', 'asd'],
      exclude: ['update', 'asd'],
    }).operations).toEqual({ create: CRUDL.OPERATIONS.create });

    expect(new CRUDL('post', {
      include: ['create', 'update', 'delete', 'asd'],
      exclude: ['update', 'list', 'qwe'],
    }).operations).toEqual({ create: CRUDL.OPERATIONS.create, delete: CRUDL.OPERATIONS.delete });

    expect(new CRUDL('post', {
      include: ['create', 'update', 'delete', 'asd'],
      exclude: ['update', 'delete', 'list', 'qwe'],
    }).operations).toEqual({ create: CRUDL.OPERATIONS.create });
  });
});
