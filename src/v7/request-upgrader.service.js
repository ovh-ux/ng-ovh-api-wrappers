/* eslint-disable no-param-reassign */
/**
 * @name apiv7RequestUpgrader
 * @description
 * # apiv7RequestUpgrader
 *
 * This service's responsibility is to apply the correct querystring or headers
 * to implement the Apiv7Request config.
 *
 * @see Apiv7Request
 * @private
 */
import angular from 'angular';
import merge from 'lodash/merge';

export default /* @ngInject */ function (apiv7AggregationResponseTransformer) {
  function applyLimit(apiOptions, v7Params) {
    if (apiOptions.limit > 0) {
      v7Params.$limit = apiOptions.limit;
    }
  }

  function applyOffset(apiOptions, v7Params) {
    if (apiOptions.offset > 0) {
      v7Params.$offset = apiOptions.offset;
    }
  }

  function applyExpand(apiOptions, v7Params) {
    if (angular.isDefined(apiOptions.expansion)) {
      v7Params.$expand = 1;
    }
  }

  function applyFilter(apiOptions, action) {
    if (angular.isArray(apiOptions.filters)) {
      apiOptions.filters.forEach((filter) => {
        const filterParamName = [filter.field, filter.comparator].join(':');
        action.params[filterParamName] = angular.isArray(filter.reference) ? filter.reference.join(',') : filter.reference;
      });
    }
  }

  function applySort(apiOptions, v7Params) {
    if (apiOptions.sort) {
      v7Params.$sort = apiOptions.sort.field;
      v7Params.$order = apiOptions.sort.order;
    }
  }

  function applyBatch(apiOptions, v7Params, action) {
    if (apiOptions.batch) {
      v7Params.$batch = apiOptions.batch.separator;
      delete action.params[apiOptions.batch.parameter];
      action.options.isArray = true;
      action.options.url = action.options.url.replace(`:${apiOptions.batch.parameter}`, apiOptions.batch.values.join(apiOptions.batch.separator));
    }
  }

  function applyAggregation(apiOptions, v7Params, action) {
    if (apiOptions.aggregation) {
      let aggregParams = apiOptions.aggregation;

      // be sure that aggregation option is an Array.
      // This should be the case if Apiv7Request.aggregate method is used
      if (!angular.isArray(aggregParams)) {
        aggregParams = [aggregParams];
      }
      v7Params.$aggreg = 1;
      action.options.isArray = true;
      action.options.transformResponse = apiv7AggregationResponseTransformer.create(
        action.options,
        aggregParams,
      );
      aggregParams.forEach((aggregParam) => {
        action.params[aggregParam] = undefined;
        if (action.options.url) {
          action.options.url = action.options.url.replace(`:${aggregParam}`, '*');
        }
      });
    }
  }

  return {
    /**
     * @param {Object} params
     * @param {Object} actionOptions
     * @param {Object} apiOptions
     * @returns {{options: (*|Object), params: (*|{})}}
     */
    buildAction(params, actionOptions, apiOptions) {
      const action = {
        params: angular.copy(params),
        options: angular.copy(actionOptions),
      };
      const v7Params = {};
      merge(action.options, {
        headers: {
          'X-Ovh-ApiVersion': 'beta',
        },
        serviceType: 'apiv7',
      });
      applyExpand(apiOptions, v7Params);
      applyLimit(apiOptions, v7Params);
      applyOffset(apiOptions, v7Params);
      applyAggregation(apiOptions, v7Params, action);
      applyBatch(apiOptions, v7Params, action);

      // TODO --> feature mask
      applySort(apiOptions, v7Params);
      applyFilter(apiOptions, action);

      angular.extend(action.params, v7Params);
      return action;
    },
  };
}
/* eslint-enable no-param-reassign */
