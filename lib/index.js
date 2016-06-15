import { fromJS } from 'immutable';

/**
 * Returns true if item is immutable, from immutable.js.
 * @param  {Object} item - Object to test.
 * @return {bool}      True if immutable.
 */
export const isImmutable = (item) => typeof item.toJS === 'function';

/**
 * Action types for a resource.
 * @param  {string} resource - Name of resource.
 * @return {Object}          Object of resource action types.
 */
export const actionTypesFor = (resource) => {
  const resourceName = resource.toUpperCase();
  return {
    fetchStart: `${resourceName}_FETCH_START`,
    fetchSuccess: `${resourceName}_FETCH_SUCCESS`,
    fetchError: `${resourceName}_FETCH_ERROR`,
  };
};

/**
 * Action creaters for a resource
 * @param  {string} resource - Name of resource.
 * @return {Object}          Object of resource action creators.
 */
export const actionCreatorsFor = (resource) => {
  const actionTypes = actionTypesFor(resource);

  return {
    fetchStart: () => ({
      type: actionTypes.fetchStart,
    }),
    fetchSuccess: data => ({
      type: actionTypes.fetchSuccess,
      data,
    }),
    fetchError: error => ({
      type: actionTypes.fetchError,
      error,
    }),
  };
};

/**
 * Reducers for a resource
 * @param  {string} resource - Name of resource.
 * @return {func}          Reducer for resource.
 */
export const reducersFor = (resource) => {
  const actionTypes = actionTypesFor(resource);

  // default state
  let defaultState = {
    isFetching: false,
    error: null,
  };
  defaultState[resource] = fromJS([]);
  defaultState = fromJS(defaultState);

  return (state, action) => {
    // state must be immutable, otherwise we won't reduce it!
    if (!state) return defaultState;
    if (!isImmutable(state)) return state || defaultState;

    const current = state.toJS();
    let newState;
    switch (action.type) {
      /** RESOURCES_FETCH_START */
      case actionTypes.fetchStart: {
        newState = {
          ...current,
          isFetching: true,
          error: null,
        };
        return fromJS(newState);
      }
      /** RESOURCES_FETCH_SUCCESS */
      case actionTypes.fetchSuccess: {
        newState = {
          ...current,
          isFetching: false,
          error: null,
        };
        newState[resource] = action.data;
        return fromJS(newState);
      }
      /** RESOURCES_FETCH_ERROR */
      case actionTypes.fetchError: {
        newState = {
          ...current,
          isFetching: false,
          error: action.error,
        };
        return fromJS(newState);
      }

      default: {
        return state;
      }
    }
  };
};

/**
 * Create initial state from a reducer
 * @param  {function} reducer - Reducer.
 */
export const initialFrom = (reducer) => reducer(undefined, { type: undefined });
