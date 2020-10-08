import plural from '@/helpers/plurals';

export default function snakeCase(key, operation = {}) {
  let snake = key
    // FooBar -> Foo_Bar, fooBar -> foo_Bar
    .replace(/[A-Z]/g, (letter, index) => `${index > 0 ? '_' : ''}${letter}`)
    // foo_Bar -> foo_bar
    .toLowerCase();

  if (operation.multiple) {
    // pluralizes the last word and pushes it back to the array, like
    // foo_bar -> foo_bars, some_fish -> some_fish, car -> cars

    snake = snake.split('_');
    snake.push(plural(snake.pop()));
    snake = snake.join('_');
  }

  return snake;
}
