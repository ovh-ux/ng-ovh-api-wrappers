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
  function applyLimit(v7Options, v7Params) {
    if (v7Options.limit > 0) {
      v7Params.$limit = v7Options.limit;
    }
  }

  function applyOffset(v7Options, v7Params) {
    if (v7Options.offset > 0) {
      v7Params.$offset = v7Options.offset;
    }
  }

  function applyExpand(v7Options, v7Params) {
    if (angular.isDefined(v7Options.expansion)) {
      v7Params.$expand = 1;
    }
  }

  function applyFilter(v7Options, action) {
    if (angular.isArray(v7Options.filters)) {
      v7Options.filters.forEach((filter) => {
        const filterParamName = [filter.field, filter.comparator].join(':');
        action.params[filterParamName] = angular.isArray(filter.reference) ? filter.reference.join(',') : filter.reference;
      });
    }
  }

  function applySort(v7Options, v7Params) {
    if (v7Options.sort) {
      v7Params.$sort = v7Options.sort.field;
      v7Params.$order = v7Options.sort.order;
    }
  }

  function applyBatch(v7Options, v7Params, action) {
    if (v7Options.batch) {
      v7Params.$batch = v7Options.batch.separator;
      delete action.params[v7Options.batch.parameter];
      action.options.isArray = true;
      action.options.url = action.options.url.replace(`:${v7Options.batch.parameter}`, v7Options.batch.values.join(v7Options.batch.separator));
    }
  }

  function applyAggregation(v7Options, v7Params, action) {
    if (v7Options.aggregation) {
      let aggregParams = v7Options.aggregation;

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
     * @param {Object} v7Options
     * @returns {{options: (*|Object), params: (*|{})}}
     */
    buildAction(params, actionOptions, v7Options) {
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
      applyExpand(v7Options, v7Params);
      applyLimit(v7Options, v7Params);
      applyOffset(v7Options, v7Params);
      applyAggregation(v7Options, v7Params, action);
      applyBatch(v7Options, v7Params, action);

      // TODO --> feature mask
      applySort(v7Options, v7Params);
      applyFilter(v7Options, action);

      angular.extend(action.params, v7Params);
      return action;
    },
  };
}
/* eslint-enable no-param-reassign */
