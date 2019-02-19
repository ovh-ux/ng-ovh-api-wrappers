/**
 * @name apiv7AggregationResponseTransformer
 * @description
 * # apiv7AggregationResponseTransformer
 *
 * This service modifies $resource options to add a http transformResponse to
 * correctly process the result of API v7 wildcard aggregation. For each items
 * in the response, it will populate the key in the response object and invoke
 * the original transformResponse if any.
 */
import angular from 'angular';

export default /* @ngInject */ function () {
  return {
    /**
     * @method
     * @param {Object} options for ngResource
     * @param {String|Array} aggregationParam url parameter or list of url parameters to replace
     *                                        with wildcard
     * @returns {Function} a transformResponse handler
     */
    create(options, aggregationParam) {
      const originalUrl = options.url;
      const originalTransformResponse = options.transformResponse;

      // be sure that aggregationParam is an Array
      let aggregationParams = aggregationParam;
      if (!angular.isArray(aggregationParams)) {
        aggregationParams = [aggregationParam];
      }

      return function (response, headers, httpCode) {
        // no processing to do on errors.
        if (httpCode !== 200) {
          return response;
        }

        // construct a regex to extract key from response items' path
        const matchExpressionStr = originalUrl
          .replace(new RegExp(`:(${aggregationParams.join('|')})`, 'g'), '([^/]+)')
          .replace(/:[^/]+/, '[^/]+');
        const keyRegex = new RegExp(matchExpressionStr);

        // process response
        const data = angular.fromJson(response);
        return data.map((item) => {
          const newItem = {};

          if (item.key) {
            newItem.key = item.key;
          } else {
            // assign path, get key from path and set error if any
            const pathMatches = item.path.match(keyRegex);
            if (pathMatches && pathMatches.length >= 1) {
              newItem.key = pathMatches[1]; // eslint-disable-line
            }
          }
          newItem.path = item.path;
          if (item.error) {
            newItem.error = item.error;
          }

          // invoke the original transformResponse handler if any
          if (originalTransformResponse) {
            newItem.value = originalTransformResponse(
              angular.toJson(item.value),
              headers,
              httpCode,
            );
          } else {
            newItem.value = item.value;
          }
          return newItem;
        });
      };
    },
  };
}
