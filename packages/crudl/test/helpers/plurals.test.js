import pluralFinder from '@/helpers/plurals';

describe('helpers/plurals', () => {
  it('should pluralize words correctly', () => {
    expect(pluralFinder()).toEqual('s'); // hehehe, not worth it :x

    expect(pluralFinder('calf')).toEqual('calves');
    expect(pluralFinder('fish')).toEqual('fish');
    expect(pluralFinder('tomato')).toEqual('tomatoes');
    expect(pluralFinder('penny')).toEqual('pennies');
    expect(pluralFinder('turtle')).toEqual('turtles');
    expect(pluralFinder('fox')).toEqual('foxes');
    expect(pluralFinder('self')).toEqual('selves');
  });
});
