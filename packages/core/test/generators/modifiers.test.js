import constantsGenerator from '@/generators/constants';

import modifiersGenerator, {
  modifierExecutorGenerator,
  spreadModifyingData,
} from '@/generators/modifiers';

import * as modifierExecutors from '@/executors/modifiers';

describe('generators/modifiers', () => {
  it('should return all the default modifiers correctly', () => {
    const constants = constantsGenerator('bar');
    const modifiers = modifiersGenerator('bar');

    expect(Object.keys(modifiers)).toEqual(
      Object.values(constants.create)
        .concat(Object.values(constants.read))
        .concat(Object.values(constants.update))
        .concat(Object.values(constants.delete))
        .concat(Object.values(constants.list)),
    );
  });

  it('should only return modifiers for included operations', () => {
    const constants = constantsGenerator('bar');
    const modifiers = modifiersGenerator('bar', { include: ['create', 'update'] });

    expect(Object.keys(modifiers)).toEqual(
      Object.values(constants.create).concat(Object.values(constants.update)),
    );
  });

  describe('spreadModifyingData', () => {
    it('should not spread the data object by default', () => {
      const data = { a: 1 };

      expect(spreadModifyingData(data)).toEqual(data);
      expect(spreadModifyingData(data)).toBe(data);
    });

    it('should not spread the data object correctly', () => {
      const data = { a: 2 };

      expect(spreadModifyingData(data, { spread: false })).toEqual(data);
      expect(spreadModifyingData(data, { spread: false })).toBe(data);
    });

    it('should spread the data object correctly', () => {
      const data = { a: 3 };

      expect(spreadModifyingData(data, { spread: true })).toEqual(data);
      expect(spreadModifyingData(data, { spread: true })).not.toBe(data);
    });
  });

  describe('modifierExecutorGenerator', () => {
    it('should call the default modifier executors correctly', () => {
      const data = { list: { items: { 1: { a: 'b' } }, loading: false, failure: null } };
      const response = { data: { foos: [{ id: 1, a: 'b' }] } };
      const error = new Error('foo bar');

      const cleanSpy = jest.spyOn(modifierExecutors, 'cleanModifier');
      const startSpy = jest.spyOn(modifierExecutors, 'startModifier');
      const successSpy = jest.spyOn(modifierExecutors, 'successModifier');
      const failureSpy = jest.spyOn(modifierExecutors, 'failureModifier');

      const key = 'foo';
      const operation = 'list';
      const constants = {
        clean: 'clean',
        start: 'start',
        success: 'success',
        failure: 'failure',
      };

      const executor = modifierExecutorGenerator(key, operation, constants);

      executor[constants.clean](data);
      expect(cleanSpy).toHaveBeenLastCalledWith(key, operation, data);

      executor[constants.start](data, response);
      expect(startSpy).toHaveBeenLastCalledWith(key, operation, data, response);

      executor[constants.success](data, response);
      expect(successSpy).toHaveBeenLastCalledWith(key, operation, data, response);

      executor[constants.failure](data, error);
      expect(failureSpy).toHaveBeenLastCalledWith(key, operation, data, error);
    });

    it('should call custom modifier executors correctly', () => {
      const data = { list: { items: { 1: { a: 'b' } }, loading: false, failure: null } };
      const response = { data: { foos: [{ id: 1, a: 'b' }] } };
      const error = new Error('foo bar');

      const key = 'foo';
      const operation = 'list';
      const constants = {
        clean: 'clean',
        start: 'start',
        success: 'success',
        failure: 'failure',
      };

      const executors = {
        clean: jest.fn(),
        start: jest.fn(),
        success: jest.fn(),
        failure: jest.fn(),
      };

      const executor = modifierExecutorGenerator(key, operation, constants, {
        modifierExecutor: executors,
      });

      executor[constants.clean](data);
      expect(executors.clean).toHaveBeenLastCalledWith(key, operation, data);

      executor[constants.start](data, response);
      expect(executors.start).toHaveBeenLastCalledWith(key, operation, data, response);

      executor[constants.success](data, response);
      expect(executors.success).toHaveBeenLastCalledWith(key, operation, data, response);

      executor[constants.failure](data, error);
      expect(executors.failure).toHaveBeenLastCalledWith(key, operation, data, error);
    });
  });
});
