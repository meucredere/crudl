import {
  extractResponseData,
  extractResponseDataArray,

  shouldOverwriteExistingItems,
  shouldUpdateItemOrItems,
} from '@/executors/helpers';

describe('executors/modifiers', () => {
  describe('extractResponseDataArray', () => {
    const a = { id: 1, name: 'foo' };
    const b = { id: 3, name: 'bar' };

    it('should work with an empty array', () => {
      expect(extractResponseDataArray()).toEqual({});
      expect(extractResponseDataArray([])).toEqual({});
    });

    it('should work with an array with the default key (id)', () => {
      expect(extractResponseDataArray([a, b])).toEqual({ [a.id]: a, [b.id]: b });
    });

    it('should work with an array with a custom key', () => {
      expect(extractResponseDataArray([a, b], 'name')).toEqual({ [a.name]: a, [b.name]: b });
    });
  });

  describe('extractResponseData', () => {
    it('should unwrap data when the operation has a key', () => {
      expect(extractResponseData(
        'foo',
        { name: 'read' },
        {},
        { read: { item: {} } },
        { data: { foo: { id: 123 } } },
      )).toEqual({ id: 123 });

      expect(extractResponseData(
        'foos',
        { name: 'list', multiple: true },
        {},
        { list: { items: {} } },
        { data: { foos: [{ id: 1 }, { id: 2 }] } },
      )).toEqual(
        extractResponseDataArray([{ id: 1 }, { id: 2 }]),
      );
    });

    it('should not unwrap data when the operation doesnt have a key', () => {
      expect(extractResponseData(
        false,
        { name: 'read' },
        {},
        { read: { item: {} }},
        { data: { id: 456 } },
      )).toEqual({ id: 456 });

      expect(extractResponseData(
        false,
        { name: 'list', multiple: true },
        {},
        { list: { items: {} } },
        { data: [{ id: 'foo' }, { id: 'bar' }] },
      )).toEqual(
        extractResponseDataArray([{ id: 'foo' }, { id: 'bar' }]),
      );
    });

    it('should not preserve list data when the crudls preserve config is not present or is false', () => {
      expect(extractResponseData(
        'foos',
        { name: 'list', multiple: true },
        {},
        { list: { items: extractResponseDataArray([{ id: 1 }, { id: 2 }]) } },
        { data: { foos: [{ id: 3 }, { id: 4 }] } },
      )).toEqual(
        extractResponseDataArray([{ id: 3 }, { id: 4 }]),
      );
    });

    it('should preserve list data when the crudls preserve config is present', () => {
      expect(extractResponseData(
        'foos',
        { name: 'list', multiple: true },
        {},
        { list: { items: extractResponseDataArray([{ id: 1 }, { id: 2 }]), config: { preserve: true } } },
        { data: { foos: [{ id: 3 }, { id: 4 }] } },
      )).toEqual(
        extractResponseDataArray([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]),
      );
    });

    it('should work with non-id identified items', () => {
      expect(extractResponseData(
        false,
        { name: 'read' },
        { identifier: 'uuid' },
        { read: { item: {} }},
        { data: { uuid: 'a1s2d3' } },
      )).toEqual({ uuid: 'a1s2d3' });

      expect(extractResponseData(
        false,
        { name: 'list', multiple: true },
        { identifier: 'uuid' },
        { list: { items: {} } },
        { data: [{ uuid: 'foo' }, { uuid: 'bar' }] },
      )).toEqual(
        extractResponseDataArray([{ uuid: 'foo' }, { uuid: 'bar' }], 'uuid'),
      );
    });
  });

  describe('shouldOverwriteExistingItems', () => {
    it('should return true by default', () => {
      expect(shouldOverwriteExistingItems()).toBeTruthy();
    });

    it('should return false when the crudls preserve config is set to true', () => {
      expect(shouldOverwriteExistingItems({
        list: { config: { preserve: true } },
      }, { name: 'list' })).toBeFalsy();
    });

    it('should return true when the crudls preserve config is set to false', () => {
      expect(shouldOverwriteExistingItems({
        list: { config: { preserve: false } },
      }, { name: 'list' })).toBeTruthy();
    });
  });

  describe('shouldUpdateItemOrItems', () => {
    it('should return "item" for single item operations and "items" for multiple ones', () => {
      expect(shouldUpdateItemOrItems({ name: 'create', multiple: false })).toEqual('item');
      expect(shouldUpdateItemOrItems({ name: 'read', multiple: false })).toEqual('item');
      expect(shouldUpdateItemOrItems({ name: 'update', multiple: false })).toEqual('item');
      expect(shouldUpdateItemOrItems({ name: 'delete', multiple: false })).toEqual('item');
      expect(shouldUpdateItemOrItems({ name: 'list', multiple: true })).toEqual('items');
    });
  });
});
