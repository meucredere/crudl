// maps crudl requests to redux actions
function actions(key, requests, suffix = '') {
  function reduce(obj, request) {
    // eslint-disable-next-line no-param-reassign
    obj[`${request}${suffix}`] = function reduxAction(params) {
      return async function reduxThunk(typeDispatch) {
        // maps crudl modifier executor callback to match redux's { type, payload }
        function dispatch(constant, payload) {
          return typeDispatch({
            type: `${key}/${constant}`,
            payload,
          });
        }

        try {
          await requests[request](dispatch, params);
        } catch (err) { /* */ }
      };
    };

    return obj;
  }

  return Object.keys(requests).reduce(reduce, {});
}

// maps crudl modifiers to redux reducers
function reducers(modifiers) {
  function reduce(obj, modifier) {
    // eslint-disable-next-line no-param-reassign
    obj[modifier] = function reduxReducer(state, action) {
      return modifiers[modifier](state, action.payload);
    };

    return obj;
  }

  return Object.keys(modifiers).reduce(reduce, {});
}

function adapter(crudl) {
  // eslint-disable-next-line no-param-reassign
  // crudl.config.spread = true;

  return {
    slice: {
      name: crudl.key,
      initialState: crudl.schema,
      reducers: reducers(crudl.modifiers),
    },
    actions: {
      ...actions(crudl.key, crudl.requests),
      ...actions(crudl.key, crudl.cleaners, '/clean'),
    },
  };
}

export default adapter;
