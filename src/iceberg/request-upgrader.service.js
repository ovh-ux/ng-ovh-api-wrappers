/* eslint-disable no-param-reassign */
/**
 * @name icebergRequestUpgrader
 * @description
 * # iceberg RequestUpgrader
 *
 * This service's responsibility is to apply the correct headers
 * to implement the Iceberg Request config.
 *
 * @see Apiv7Request
 * @private
 */
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

export default class {
  static buildAction(params, actionOptions) {
    const action = {
      params: cloneDeep(params),
      options: cloneDeep(actionOptions),
    };
    const headers = {};
    merge(action.options, {
      headers,
      serviceType: 'apiv6',
    });
    return action;
  }
}
