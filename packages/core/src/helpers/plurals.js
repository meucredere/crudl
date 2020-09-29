// based on https://github.com/sindresorhus/plur
// but optimized to crudl's needs so it weights a bit less

import irregularPlurals from 'irregular-plurals/irregular-plurals.json';

export default function pluralFinder(word = '') {
  // catch irregular plural nouns red-handed
  if (irregularPlurals[word]) {
    return irregularPlurals[word];
  }

  return `${word
    .replace(/(?:s|x|z|ch|sh)$/i, '$&e')
    .replace(/([^aeiou])y$/i, '$1ie')}s`;

  // eslint-disable-next-line no-extra-semi
};
