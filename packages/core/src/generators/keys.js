import pluralFinder from '@/helpers/plurals';
import { snakeCase as simpleSnakeCase } from 'snake-case';
import operationsGenerator from '@/generators/operations';

export function snakeCase(key, operation = {}) {
  // splits foo bar, foo_bar, foo-_----Bar, foo-bar, fooBar, (...) into [foo, bar]
  const snake = simpleSnakeCase(key).split('_');

  if (operation.multiple) {
    // pluralizes the last word and pushes it back to the array
    snake.push(pluralFinder(snake.pop()));
  }

  // returns the new snakecased string
  return snake.join('_');
}

// pluralizes, lowercases and snakecases a given string
export function pluralizeAndSnakeCase(key) {
  return snakeCase(key, { multiple: true });
}

export default function keysGenerator(key, config = {}) {
  const operations = operationsGenerator(key, config);

  function reducer(obj, operation) {
    // eslint-disable-next-line no-param-reassign
    obj[operation] = !!key && snakeCase(key, operations[operation]);

    return obj;
  }

  // returns included default operations' keys, e.g.
  // {
  //   create: some_item,
  //   list: some_items,
  //   (...)
  // }
  return {
    ...Object.keys(operations).reduce(reducer, {}),

    // overwrites default keys with custom ones in case they were given
    ...config.keys,
  };
}
