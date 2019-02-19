/**
 *  @type {Object}
 *  @description $resource default actions.
 */
export const APIV7_ENDPOINT_DEFAULT_ACTIONS = {
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
  APIV7_ENDPOINT_DEFAULT_ACTIONS,
};
