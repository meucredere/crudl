import {
  clean,
  start,
  success,
  failure,
} from '@/executors/index';

describe('executors/modifiers', () => {
  const operations = {
    list: { name: 'list', multiple: true },
    read: { name: 'read' },
  };

  const multipleData = () => ({ list: { loading: false, failure: 'foo', items: { 1: { id: 1 } }, config: {} } });
  const singleData = () => ({ read: { loading: false, failure: 'foo', item: { id: 1 }, config: {} } });

  const initialMultipleData = { list: { loading: false, failure: null, items: {}, config: {} } };
  const initialSingleData = { read: { loading: false, failure: null, item: {}, config: {} } };

  describe('clean', () => {
    it('should clean the data object to its initial scheme', () => {
      let data;

      data = multipleData();
      clean('posts', operations.list, {}, data);
      expect(data).toEqual(initialMultipleData);

      data = singleData();
      clean('post', operations.read, {}, data);
      expect(data).toEqual(initialSingleData);
    });
  });

  describe('start', () => {
    it('should clean the data object and set loading as true', () => {
      let data;

      data = multipleData();
      start('posts', operations.list, {}, data);
      expect(data).toEqual({ ...initialMultipleData, list: { ...initialMultipleData.list, loading: true } });

      data = singleData();
      start('post', operations.read, {}, data);
      expect(data).toEqual({ ...initialSingleData, read: { ...initialSingleData.read, loading: true } });
    });

    it('should clean the data object, set loading as true and preserve exiting data when crudls preserve config is true', () => {
      let data;

      data = multipleData();
      start('posts', operations.list, {}, data, { crudl: { preserve: true }});
      expect(data).toEqual({ ...initialMultipleData, list: { ...initialMultipleData.list, items: { 1: { id: 1 } }, loading: true, config: { preserve: true } } });

      data = singleData();
      start('post', operations.read, {}, data, { crudl: { preserve: true }});
      expect(data).toEqual({ ...initialSingleData, read: { ...initialSingleData.read, item: { id: 1 }, loading: true, config: { preserve: true } } });
    });
  });

  describe('success', () => {
    it('should update new results and stop loading', () => {
      let data;

      data = multipleData();
      success('posts', operations.list, {}, data, { data: { posts: [{ id: 2 }] } });
      expect(data).toEqual({ ...initialMultipleData, list: { ...initialMultipleData.list, items: { 2: { id: 2 } } } });

      data = singleData();
      success('post', operations.read, {}, data, { data: { post: { id: 2 } } });
      expect(data).toEqual({ ...initialSingleData, read: { ...initialSingleData.read, item: { id: 2 } } });

      data = { list: { loading: true, failure: 'foo', items: { id: 1 } } };
      success('posts', operations.list, {}, data, { data: { posts: [] } });
      expect(data).toEqual(initialMultipleData);
    });

    it('should update new results and preserve exiting data (execept on false successes, like on {} responses) when crudls preserve config is true, and also reset crudls request config', () => {
      let data;

      data = multipleData();
      data.list.config.preserve = true;
      success('posts', operations.list, {}, data, { data: { posts: [{ id: 2 }] } });
      expect(data).toEqual({ ...data, list: { ...data.list, items: { 1: { id: 1 }, 2: { id: 2 } }, config: {} } });

      data = singleData();
      data.read.config.preserve = true;
      success('post', operations.read, {}, data, { data: { post: { id: 2 } } });
      expect(data).toEqual({ ...data, read: { ...data.read, item: { id: 2 }, config: {} } });

      // false successes

      data = multipleData();
      data.list.config.preserve = true;
      success('posts', operations.list, {}, data);
      expect(data).toEqual({ ...initialMultipleData, list: { ...initialMultipleData.list, items: { 1: { id: 1 } } } });

      data = singleData();
      data.read.config.preserve = true;
      success('post', operations.read, {}, data, {});
      expect(data).toEqual(initialSingleData);
    });
  });

  describe('failure', () => {
    it('should update the data error property and stop loading', () => {
      let data;

      data = multipleData();
      failure('posts', operations.list, {}, data, { response: { data: 'foo bar' } });
      expect(data).toEqual({ ...initialMultipleData, list: { ...initialMultipleData.list, failure: 'foo bar' } });

      data = singleData();
      failure('post', operations.read, {}, data, { response: 'foo bar' });
      expect(data).toEqual({ ...initialSingleData, read: { ...initialSingleData.read, failure: 'foo bar' } });

      data = singleData();
      failure('post', operations.read, {}, data, 'foo bar');
      expect(data).toEqual({ ...initialSingleData, read: { ...initialSingleData.read, failure: 'foo bar' } });
    });

    it('should modify the original object and preserve exiting data when crudls preserve config is true', () => {
      let data;

      data = multipleData();
      data.list.config.preserve = true;
      failure('posts', operations.list, {}, data, { response: { data: 'foo bar' } });
      expect(data).toEqual({ list: { loading: false, failure: 'foo bar', items: { 1: { id: 1 } }, config: {} } });

      data = singleData();
      data.read.config.preserve = true;
      failure('post', operations.read, {}, data, { response: { data: 'foo bar' } });
      expect(data).toEqual({ read: { loading: false, failure: 'foo bar', item: { id: 1 }, config: {} } });

      data = singleData();
      data.read.config.preserve = true;
      failure('post', operations.read, {}, data);
      expect(data).toEqual({ read: { loading: false, failure: {}, item: { id: 1 }, config: {} } });
    });

    it('should set the failure data correctly when there\'s no response', () => {
      const data = { list: { loading: false, failure: 'hello, world!', items: {}, config: {} } };
      failure('posts', operations.list, {}, data, 'hello, world!');
      expect(data).toEqual({ list: { loading: false, failure: 'hello, world!', items: {}, config: {} } });
    });
  });

  it('should not modify the original data object when crudls spread config is true', () => {
    let data;
    let result;

    data = multipleData();
    result = clean('posts', operations.list, { spread: true }, data);
    expect(result).toEqual(initialMultipleData);
    expect(data).toEqual(multipleData());

    data = multipleData();
    result = start('posts', operations.list, { spread: true }, data);
    expect(result).toEqual({ ...initialMultipleData, list: { ...initialMultipleData.list, loading: true } });
    expect(data).toEqual(multipleData());

    data = multipleData();
    result = success('posts', operations.list, { spread: true }, data, { data: { posts: [{ id: 1 }] }});
    expect(result).toEqual({ ...initialMultipleData, list: { ...initialMultipleData.list, items: { 1: { id: 1 } }, failure: null } });
    expect(data).toEqual(multipleData());

    data = multipleData();
    result = failure('posts', operations.list, { spread: true }, data, 'foo bar');
    expect(result).toEqual({ ...initialMultipleData, list: { ...initialMultipleData.list, failure: 'foo bar' } });
    expect(data).toEqual(multipleData());
  });
});
