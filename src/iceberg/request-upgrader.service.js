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
import isNull from 'lodash/isNull';
import merge from 'lodash/merge';

export default class IcebergRequestUpgrader {
  static buildExpand({ expansion }) {
    if (!isNull(expansion)) {
      return {
        'X-Pagination-Mode': expansion,
      };
    }

    return {};
  }

  static buildOffset({ expansion, offset }) {
    if (offset > 0 && expansion === 'CachedObjectList-Pages') {
      return {
        'X-Pagination-Number': offset,
      };
    }

    return {};
  }

  static buildLimit({ limit }) {
    if (limit > 0) {
      return {
        'X-Pagination-Size': limit,
      };
    }

    return {};
  }

  static buildHeaders(apiOptions) {
    return {
      ...IcebergRequestUpgrader.buildExpand(apiOptions),
      ...IcebergRequestUpgrader.buildOffset(apiOptions),
      ...IcebergRequestUpgrader.buildLimit(apiOptions),
    };
  }

  static buildAction(params, actionOptions, apiOptions) {
    const action = {
      params: cloneDeep(params),
      options: cloneDeep(actionOptions),
    };

    merge(action.options, {
      headers: IcebergRequestUpgrader.buildHeaders(apiOptions),
      serviceType: 'apiv6',
    });
    return action;
  }
}
