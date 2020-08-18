/**
 *  @type {Object}
 *  @description $resource default actions.
 */
export const API_ENDPOINT_DEFAULT_ACTIONS = {
  query: {
    method: 'GET',
    isArray: true,
  },
  get: {
    method: 'GET',
  },
  save: {
    method: 'POST',
  },
  delete: {
    method: 'DELETE',
  },
  remove: {
    method: 'DELETE',
  },
};

export default {
  API_ENDPOINT_DEFAULT_ACTIONS,
};
