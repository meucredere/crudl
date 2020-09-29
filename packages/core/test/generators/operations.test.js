import generator, { OPERATIONS, filter } from '@/generators/operations';

describe('generators/operations', () => {
  describe('filter', () => {
    it('should filter operations correctly', () => {
      expect(filter()).toEqual(Object.keys(OPERATIONS));
      expect(filter({ include: ['create'] })).toEqual(['create']);
      expect(filter({ include: ['create', 'read'] })).toEqual(['create', 'read']);
      expect(filter({ include: ['create', 'read'], exclude: 'create' })).toEqual(['read']);
    });
  });

  it('should export the default CRUDL operations', () => {
    expect(Object.keys(OPERATIONS)).toEqual(['create', 'read', 'update', 'delete', 'list']);

    expect(OPERATIONS.create.multiple).toEqual(false);
    expect(OPERATIONS.read.multiple).toEqual(false);
    expect(OPERATIONS.update.multiple).toEqual(false);
    expect(OPERATIONS.delete.multiple).toEqual(false);
    expect(OPERATIONS.list.multiple).toEqual(true);

    expect(OPERATIONS.create.identified).toEqual(false);
    expect(OPERATIONS.read.identified).toEqual(true);
    expect(OPERATIONS.update.identified).toEqual(true);
    expect(OPERATIONS.delete.identified).toEqual(true);
    expect(OPERATIONS.list.identified).toEqual(false);

    expect(OPERATIONS.create.method).toEqual('post');
    expect(OPERATIONS.read.method).toEqual('get');
    expect(OPERATIONS.update.method).toEqual('put');
    expect(OPERATIONS.delete.method).toEqual('delete');
    expect(OPERATIONS.list.method).toEqual('get');
  });

  it('should return all the operations if no include or exclude is passed', () => {
    expect(generator()).toEqual(OPERATIONS);

    expect(generator(undefined, {
      include: [],
    })).toEqual(OPERATIONS);

    expect(generator(undefined, {
      exclude: [],
    })).toEqual(OPERATIONS);

    expect(generator(undefined, {
      include: [],
      exclude: [],
    })).toEqual(OPERATIONS);
  });

  it('should return operations correctly when using "include" only', () => {
    expect(generator(undefined, {
      include: ['create'],
    })).toEqual({ create: OPERATIONS.create });

    expect(generator(undefined, {
      include: ['create', 'asd'],
    })).toEqual({ create: OPERATIONS.create });

    expect(generator(undefined, {
      include: ['create', 'update'],
    })).toEqual({ create: OPERATIONS.create, update: OPERATIONS.update });
  });

  it('should return operations correctly when using "exclude" only', () => {
    expect(generator(undefined, {
      exclude: ['create', 'update'],
    })).toEqual({ read: OPERATIONS.read, delete: OPERATIONS.delete, list: OPERATIONS.list });

    expect(generator(undefined, {
      exclude: ['create', 'asd', 'delete'],
    })).toEqual({ read: OPERATIONS.read, update: OPERATIONS.update, list: OPERATIONS.list });

    expect(generator(undefined, {
      exclude: ['create', 'update'],
    })).toEqual({ read: OPERATIONS.read, delete: OPERATIONS.delete, list: OPERATIONS.list });
  });

  it('should return operations correctly when using both "include" and "exclude"', () => {
    expect(generator(undefined, {
      include: ['create', 'read'],
      exclude: ['create'],
    })).toEqual({ read: OPERATIONS.read });

    expect(generator(undefined, {
      include: ['create', 'update', 'asd'],
      exclude: ['update', 'asd'],
    })).toEqual({ create: OPERATIONS.create });

    expect(generator(undefined, {
      include: ['create', 'update', 'asd'],
      exclude: ['update', 'asd'],
    })).toEqual({ create: OPERATIONS.create });

    expect(generator(undefined, {
      include: ['create', 'update', 'delete', 'asd'],
      exclude: ['update', 'list', 'qwe'],
    })).toEqual({ create: OPERATIONS.create, delete: OPERATIONS.delete });

    expect(generator(undefined, {
      include: ['create', 'update', 'delete', 'asd'],
      exclude: ['update', 'delete', 'list', 'qwe'],
    })).toEqual({ create: OPERATIONS.create });
  });
});
