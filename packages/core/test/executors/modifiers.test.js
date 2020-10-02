import {
  prepareModifyingData,
  prepareModifyingDataArray,

  shouldOverwriteData,
  shouldUpdateItemOrItems,

  cleanModifier,
  startModifier,
  successModifier,
  failureModifier,
} from '@/executors/modifiers';

describe('executors/modifiers', () => {
  describe('prepareModifyingDataArray', () => {
    const a = { id: 1, name: 'foo' };
    const b = { id: 3, name: 'bar' };

    it('should key an empty array', () => {
      expect(prepareModifyingDataArray()).toEqual({});
      expect(prepareModifyingDataArray([])).toEqual({});
    });

    it('should key an array with the default key (id)', () => {
      expect(prepareModifyingDataArray([a, b])).toEqual({ [a.id]: a, [b.id]: b });
    });

    it('should key an array with a custom key', () => {
      expect(prepareModifyingDataArray([a, b], 'name')).toEqual({ [a.name]: a, [b.name]: b });
    });
  });

  describe('prepareModifyingData', () => {
    it('should unwrap data when the operation has a key', () => {
      expect(prepareModifyingData(
        'foo',
        'read', {
          read: { item: {} },
        }, {
          data: { foo: { id: 123 } },
        },
      )).toEqual({ id: 123 });

      expect(prepareModifyingData(
        'foos',
        'list', {
          list: { items: {} },
        }, {
          data: { foos: [{ id: 1 }, { id: 2 }] },
        },
      )).toEqual(
        prepareModifyingDataArray([{ id: 1 }, { id: 2 }]),
      );
    });

    it('should not unwrap data when the operation doesnt have a key', () => {
      expect(prepareModifyingData(
        false,
        'read', {
          read: { item: {} },
        }, {
          data: { id: 456 },
        },
      )).toEqual({ id: 456 });

      expect(prepareModifyingData(
        false,
        'list', {
          list: { items: {} },
        }, {
          data: [{ id: 'foo' }, { id: 'bar' }],
        },
      )).toEqual(
        prepareModifyingDataArray([{ id: 'foo' }, { id: 'bar' }]),
      );
    });

    it('should not preserve list data when the crudls preserve config is not present or is false', () => {
      expect(prepareModifyingData(
        'foos',
        'list', {
          list: { items: prepareModifyingDataArray([{ id: 1 }, { id: 2 }]) },
        }, {
          data: { foos: [{ id: 3 }, { id: 4 }] },
        },
      )).toEqual(
        prepareModifyingDataArray([{ id: 3 }, { id: 4 }]),
      );
    });

    it('should preserve list data when the crudls preserve config is present', () => {
      expect(prepareModifyingData(
        'foos',
        'list', {
          list: {
            items: prepareModifyingDataArray([{ id: 1 }, { id: 2 }]),
            config: { preserve: true },
          },
        }, {
          data: { foos: [{ id: 3 }, { id: 4 }] },
        },
      )).toEqual(
        prepareModifyingDataArray([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]),
      );
    });
  });

  describe('shouldOverwriteData', () => {
    it('should return true by default', () => {
      expect(shouldOverwriteData()).toBeTruthy();
    });

    it('should return false when the crudls preserve config is set to true', () => {
      expect(shouldOverwriteData({
        list: { config: { preserve: true } },
      }, 'list')).toBeFalsy();
    });

    it('should return true when the crudls preserve config is set to false', () => {
      expect(shouldOverwriteData({
        list: { config: { preserve: false } },
      }, 'list')).toBeTruthy();
    });
  });

  describe('shouldUpdateItemOrItems', () => {
    it('should return "item" for single item operations and "items" for multiple ones', () => {
      expect(shouldUpdateItemOrItems('create')).toEqual('item');
      expect(shouldUpdateItemOrItems('read')).toEqual('item');
      expect(shouldUpdateItemOrItems('update')).toEqual('item');
      expect(shouldUpdateItemOrItems('delete')).toEqual('item');
      expect(shouldUpdateItemOrItems('list')).toEqual('items');
    });
  });

  describe('cleanModifier', () => {
    it('should modify the original object correctly and also return it', () => {
      let data;

      const multipleData = { list: { loading: false, failure: null, items: {}, config: {} } };
      data = { list: { loading: true, failure: 'foo', items: { id: 1 } } };
      expect(cleanModifier(undefined, 'list', data)).toEqual(multipleData);
      data = { list: { loading: true, failure: 'foo', items: { id: 1 } } };
      cleanModifier(undefined, 'list', data);
      expect(data).toEqual(multipleData);

      const singleData = { read: { loading: false, failure: null, item: {}, config: {} } };
      data = { read: { loading: true, failure: 'foo', item: { id: 1 } } };
      expect(cleanModifier(undefined, 'read', data)).toEqual(singleData);
      data = { read: { loading: true, failure: 'foo', item: { id: 1 } } };
      cleanModifier(undefined, 'read', data);
      expect(data).toEqual(singleData);
    });
  });

  describe('startModifier', () => {
    it('should modify the original object correctly and also return it', () => {
      let data;

      const multipleData = { list: { loading: true, failure: null, items: {}, config: {} } };
      data = { list: { loading: false, failure: 'foo', items: { id: 1 } } };
      expect(startModifier(undefined, 'list', data)).toEqual(multipleData);
      data = { list: { loading: false, failure: 'foo', items: { id: 1 } } };
      startModifier(undefined, 'list', data);
      expect(data).toEqual(multipleData);

      const singleData = { read: { loading: true, failure: null, item: {}, config: {} } };
      data = { read: { loading: false, failure: 'foo', item: { id: 1 } } };
      expect(startModifier(undefined, 'read', data)).toEqual(singleData);
      data = { read: { loading: false, failure: 'foo', item: { id: 1 } } };
      startModifier(undefined, 'read', data);
      expect(data).toEqual(singleData);
    });

    it('should modify the original object and preserve exiting data when crudls preserve config is true', () => {
      let data;

      data = { list: { loading: false, failure: 'foo', items: { id: 1 }, config: {} } };
      startModifier(undefined, 'list', data, { crudl: { preserve: true }});
      expect(data).toEqual({ list: { loading: true, failure: null, items: { id: 1 }, config: { preserve: true } } });

      data = { read: { loading: false, failure: 'foo', item: { id: 1 }, config: {} } };
      startModifier(undefined, 'read', data, { crudl: { preserve: true }});
      expect(data).toEqual({ read: { loading: true, failure: null, item: { id: 1 }, config: { preserve: true } } });
    });
  });

  describe('successModifier', () => {
    it('should modify the original object correctly and also return it', () => {
      let data;

      const multipleData = { list: { loading: false, failure: null, items: { 2: { id: 2 } }, config: {} } };
      data = { list: { loading: true, failure: 'foo', items: { id: 1 } } };
      expect(successModifier(undefined, 'list', data, { data: [{ id: 2 }] })).toEqual(multipleData);
      data = { list: { loading: true, failure: 'foo', items: { id: 1 } } };
      successModifier(undefined, 'list', data, { data: [{ id: 2 }] });
      expect(data).toEqual(multipleData);

      const singleData = { read: { loading: false, failure: null, item: { id: 2 }, config: {} } };
      data = { read: { loading: true, failure: 'foo', item: { id: 1 } } };
      expect(successModifier(undefined, 'read', data, { data: { id: 2 } })).toEqual(singleData);
      data = { read: { loading: true, failure: 'foo', item: { id: 1 } } };
      successModifier(undefined, 'read', data, { data: { id: 2 } });
      expect(data).toEqual(singleData);

      const emptyData = { list: { loading: false, failure: null, items: {}, config: {} } };
      data = { list: { loading: true, failure: 'foo', items: { id: 1 } } };
      expect(successModifier(undefined, 'list', data)).toEqual({ list: { loading: false, failure: null, items: {}, config: {} } });
      data = { list: { loading: true, failure: 'foo', items: { id: 1 } } };
      successModifier(undefined, 'list', data);
      expect(data).toEqual(emptyData);
    });

    it('should modify the original object and preserve exiting data when crudls preserve config is true and reset crudls config after (execept on false successes, aka empty response)', () => {
      let data;

      data = { list: { loading: true, failure: 'foo', items: { 1: { id: 1 } }, config: { preserve: true } } };
      successModifier(undefined, 'list', data, { data: [{ id: 2 }] });
      expect(data).toEqual({ list: { loading: false, failure: null, items: { 1: { id: 1 }, 2: { id: 2 } }, config: {} } });

      data = { read: { loading: true, failure: 'foo', item: { id: 1 }, config: { preserve: true } } };
      successModifier(undefined, 'read', data, { data: { id: 2 } });
      expect(data).toEqual({ read: { loading: false, failure: null, item: { id: 2 }, config: {} } });

      // false successes
      data = { read: { loading: true, failure: 'foo', item: { id: 1 }, config: { preserve: true } } };
      successModifier(undefined, 'read', data);
      expect(data).toEqual({ read: { loading: false, failure: null, item: {}, config: {} } });
    });
  });

  describe('failureModifier', () => {
    it('should modify the original object correctly and also return it', () => {
      let data;

      const multipleData = { list: { loading: false, failure: 'foo bar', items: {}, config: {} } };
      data = { list: { loading: true, failure: null, items: { id: 1 }, config: {} } };
      expect(failureModifier(undefined, 'list', data, { response: { data: 'foo bar' } })).toEqual(multipleData);
      data = { list: { loading: true, failure: null, items: { id: 1 }, config: {} } };
      failureModifier(undefined, 'list', data, { response: { data: 'foo bar' } });
      expect(data).toEqual(multipleData);

      const singleData = { read: { loading: false, failure: 'foo bar', item: {}, config: {} } };
      data = { read: { loading: true, failure: null, item: { id: 1 } } };
      expect(failureModifier(undefined, 'read', data, { response: { data: 'foo bar' } })).toEqual(singleData);
      data = { read: { loading: true, failure: null, item: { id: 1 } } };
      failureModifier(undefined, 'read', data, { response: { data: 'foo bar' } });
      expect(data).toEqual(singleData);

      const emptyData = { read: { loading: false, failure: {}, item: {}, config: {} } };
      data = { read: { loading: true, failure: null, item: { id: 1 } } };
      expect(failureModifier(undefined, 'read', data)).toEqual(emptyData);
      data = { read: { loading: true, failure: null, item: { id: 1 } } };
      failureModifier(undefined, 'read', data);
      expect(data).toEqual(emptyData);
    });

    it('should modify the original object and preserve exiting data when crudls preserve config is true', () => {
      let data;

      data = { list: { loading: false, failure: 'foo bar', items: { 1: { id: 1 } }, config: { preserve: true } } };
      failureModifier(undefined, 'list', data, { response: { data: 'foo bar' } });
      expect(data).toEqual({ list: { loading: false, failure: 'foo bar', items: { 1: { id: 1 } }, config: {} } });

      data = { read: { loading: false, failure: 'foo bar', item: { id: 1 }, config: { preserve: true } } };
      failureModifier(undefined, 'read', data, { response: { data: 'foo bar' } });
      expect(data).toEqual({ read: { loading: false, failure: 'foo bar', item: { id: 1 }, config: {} } });

      data = { read: { loading: false, failure: 'foo bar', item: { id: 1 }, config: { preserve: true } } };
      failureModifier(undefined, 'read', data);
      expect(data).toEqual({ read: { loading: false, failure: {}, item: { id: 1 }, config: {} } });
    });

    it('should set the failure data correctly when there\'s no response', () => {
      const data = { list: { loading: false, failure: 'hello, world!', items: {}, config: {} } };
      failureModifier(undefined, 'list', data, 'hello, world!');
      expect(data).toEqual({ list: { loading: false, failure: 'hello, world!', items: {}, config: {} } });
    });
  });
});
