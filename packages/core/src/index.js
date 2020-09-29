import operationsGenerator from '@/generators/operations';
import keysGenerator from '@/generators/keys';
import endpointsGenerator from '@/generators/endpoints';
import methodsGenerator from '@/generators/methods';
import constantsGenerator from '@/generators/constants';
import requestsGenerator from '@/generators/requests';
import modifiersGenerator from '@/generators/modifiers';
import dataGenerator from '@/generators/data';

export default function generator(key, config = {}) {
  const crudl = {};

  crudl.operations = operationsGenerator(key, config, crudl);
  crudl.keys = keysGenerator(key, config, crudl);
  crudl.endpoints = endpointsGenerator(key, config, crudl);
  crudl.methods = methodsGenerator(key, config, crudl);
  crudl.constants = constantsGenerator(key, config, crudl);
  crudl.requests = requestsGenerator(key, config, crudl);
  crudl.modifiers = modifiersGenerator(key, config, crudl);
  crudl.data = dataGenerator(key, config, crudl);

  return crudl;
}
