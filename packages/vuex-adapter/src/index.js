// maps crudl requests to vuex actions
function actions(requests, suffix = '') {
  function reduce(obj, request) {
    // eslint-disable-next-line no-param-reassign
    obj[`${request}${suffix}`] = function vuexAction({ commit }, payload) {
      return requests[request](commit, payload);
    };

    return obj;
  }

  return Object.keys(requests).reduce(reduce, {});
}

// maps crudl modifiers to vuex mutations
function mutations(modifiers) {
  function reduce(obj, modifier) {
    // eslint-disable-next-line no-param-reassign
    obj[modifier] = function vuexMutation(state, payload) {
      return modifiers[modifier](state, payload);
    };

    return obj;
  }

  return Object.keys(modifiers).reduce(reduce, {});
}

function adapter(crudl) {
  // eslint-disable-next-line no-param-reassign
  crudl.config.spread = false;

  function state() {
    return crudl.schema;
  }

  return {
    namespaced: true,
    state,
    actions: {
      ...actions(crudl.cleaners, '/clean'),
      ...actions(crudl.requests),
    },
    mutations: mutations(crudl.modifiers),
  };
}

export default adapter;
