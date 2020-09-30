import operationsGenerator from '@/generators/operations';
import keysGenerator from '@/generators/keys';
import endpointsGenerator from '@/generators/endpoints';
import methodsGenerator from '@/generators/methods';
import constantsGenerator from '@/generators/constants';
import requestsGenerator from '@/generators/requests';
import modifiersGenerator from '@/generators/modifiers';
import dataGenerator from '@/generators/data';

export default function crudl(key, config = {}) {
  return {
    operations: operationsGenerator(key, config),
    keys: keysGenerator(key, config),
    endpoints: endpointsGenerator(key, config),
    methods: methodsGenerator(key, config),
    constants: constantsGenerator(key, config),
    requests: requestsGenerator(key, config),
    modifiers: modifiersGenerator(key, config),
    data: dataGenerator(key, config),
  };
}
