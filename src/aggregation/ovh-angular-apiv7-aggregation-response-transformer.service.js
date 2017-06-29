angular
    .module("ovh-angular-apiv7")

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
    .service("apiv7AggregationResponseTransformer", function () {
        "use strict";
        return {
            /**
             * @method
             * @param {Object} options for ngResource
             * @param {String} aggregationParam url parameter to replace with wildcard
             * @returns {Function} a transformResponse handler
             */
            create: function (options, aggregationParam) {
                var originalUrl = options.url;
                var originalTransformResponse = options.transformResponse;

                return function (response, headers, httpCode) {
                    // no processing to do on errors.
                    if (httpCode !== 200) {
                        return response;
                    }

                    // construct a regex to extract key from response items' path
                    var matchExpressionStr = originalUrl.replace(":" + aggregationParam, "([^/]+)").replace(/:[^\/]+/, "[^/]+");
                    var keyRegex = new RegExp(matchExpressionStr);

                    // process response
                    var data = angular.fromJson(response);
                    return data.map(function (item) {
                        var newItem = {};

                        if (item.key) {
                            newItem.key = item.key;
                        } else {
                            // assign path, get key from path and set error if any
                            var pathMatches = item.path.match(keyRegex);
                            if (pathMatches && pathMatches.length >= 1) {
                                newItem.key = pathMatches[1];
                            }
                        }
                        newItem.path = item.path;
                        if (item.error) {
                            newItem.error = item.error;
                        }

                        // invoke the original transformResponse handler if any
                        if (originalTransformResponse) {
                            newItem.value = originalTransformResponse(angular.toJson(item.value), headers, httpCode);
                        } else {
                            newItem.value = item.value;
                        }
                        return newItem;
                    });
                };
            }
        };
    });
