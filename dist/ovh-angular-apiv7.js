/**
 * @ngdoc overview
 * @name ovh-angular-apiv7
 * @description
 * # ovh-angular-apiv7
 *
 * The ovh-angular-apiv7 module is an angular component designed to configure {@link ovh-angular-apiv7.Apiv7Endpoint Apiv7Endpoints}
 * with the same interface as a $resource yet allow for extended configuration by providing
 * {@link ovh-angular-apiv7.Apiv7Request Apiv7Requests} objects that can be modified with chained methods to define the
 * parameters sent to APIv7.
 */
angular.module("ovh-angular-apiv7", ["ngResource"]);

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

angular
    .module("ovh-angular-apiv7")

    /**
     *  @type {Object}
     *  @description $resource default actions.
     */
    .constant("APIV7_ENDPOINT_DEFAULT_ACTIONS", {
        query: {
            method: "GET",
            isArray: true
        },
        get: {
            method: "GET"
        },
        save: {
            method: "POST"
        },
        "delete": {
            method: "DELETE"
        },
        remove: {
            method: "DELETE"
        }
    });

angular.module("ovh-angular-apiv7").factory("Apiv7Endpoint", ["Apiv7Request", "APIV7_ENDPOINT_DEFAULT_ACTIONS", function (Apiv7Request, APIV7_ENDPOINT_DEFAULT_ACTIONS) {
    "use strict";

    /**
         * @ngdoc service
         * @name ovh-angular-apiv7.Apiv7Endpoint
         * @description
         * # Apiv7Endpoint
         *
         * Creates ngResource endpoints that provides facilities to easily
         * leverage APIv7 functionality.
         *
         * For each action, ($resource defaults + custom actions specified in), a method is
         * created on the endpoint object. These methods create {@link ovh-angular-apiv7.Apiv7Request} objects
         * which implements APIv7 operations (.sort, filter, ...) and returns a $resource instance
         * on execute().
         *
         * The constructor accepts all the standard options of
         * {@link https://docs.angularjs.org/api/ngResource/service/$resource $resource} as well as
         * extra action options specific to Apiv7Endpoint behaviours.
         **
         * Extra action options:
         * - disabledOperations: to document and warn developers about Apiv7 operations
         * not supported by the action.
         *
         * @constructor
         * @param {String} defaultUrl the default url template, can be overridden in actions
         * @param {Object} defaultParams the default url parameters, can be overridden in actions
         * @param {Object} actions Declaration of custom actions.
         * @param {Object} [resourceOptions] Custom settings.
         */
    function Apiv7Endpoint (defaultUrl, defaultParams, actions, resourceOptions) {
        // Creates the $resource default actions as well
        var actionToBuild = _.merge({}, APIV7_ENDPOINT_DEFAULT_ACTIONS, actions);
        this.createRequestBuilders(defaultUrl, defaultParams, actionToBuild, resourceOptions);
    }

    /**
         * @method
         * @description Creates a method for each action in "actions"
         * @param {String} defaultUrl
         * @param {Object} defaultParams
         * @param {Object} actions
         * @param {Object} [options]
         * @private
         */
    Apiv7Endpoint.prototype.createRequestBuilders = function (defaultUrl, defaultParams, actions, options) {
        var self = this;
        _.forOwn(actions, function (actionOpts, actionName) {
            var disabledOperations = actionOpts.disabledOperations;
            var actionOptions = _.omit(actionOpts, "disabledOperations");

            self[actionName] = function (v7Options) {
                return new Apiv7Request(defaultUrl, defaultParams, actionOptions, options, v7Options, disabledOperations);
            };
        });
    };

    return Apiv7Endpoint;
}]);

angular
    .module("ovh-angular-apiv7")

    /**
     * @ngdoc object
     * @name ovh-angular-apiv7.APIV7_FILTER_COMPARATOR
     * @type {Object}
     * @description
     *  The possible comparators for filtering with APIv7:
     *
     *  - EQUAL: =
     *  - NOT_EQUAL: <>
     *  - GREATER_OR_EQUAL: >=
     *  - GREATER_THAN: >
     *  - LESS_OR_EQUAL: <=
     *  - LESS_THAN: <
     *  - IN: in
     *  - LIKE: like
     *
     */
    .constant("APIV7_FILTER_COMPARATOR", {
        EQUAL: "=",
        NOT_EQUAL: "<>",
        GREATER_OR_EQUAL: ">=",
        GREATER_THAN: ">",
        LESS_OR_EQUAL: "<=",
        LESS_THAN: "<",
        IN: "in",
        LIKE: "like"
    })

    /**
     * @type {Object}
     * @description Enumerates the possible sort order
     */
    .constant("APIV7_SORT_ORDER", {
        ASC: "ASC",
        DESC: "DESC"
    });

angular.module("ovh-angular-apiv7").service("apiv7", ["Apiv7Endpoint", function (Apiv7Endpoint) {
    "use strict";

    /**
         * @ngdoc service
         * @name ovh-angular-apiv7.apiv7
         * @description
         * # apiv7
         *
         * Provides sugar to creates a Apiv7Endpoint without the new operator.
         *
         * @see Apiv7Endpoint
         */
    return function (defaultUrl, defaultParams, actions, resourceOptions) {
        return new Apiv7Endpoint(defaultUrl, defaultParams, actions, resourceOptions);
    };
}]);

angular
    .module("ovh-angular-apiv7")

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
    .service("apiv7RequestUpgrader", ["apiv7AggregationResponseTransformer", function (apiv7AggregationResponseTransformer) {
        "use strict";
        function applyLimit (v7Options, v7Params) {
            if (v7Options.limit > 0) {
                v7Params.$limit = v7Options.limit;
            }
        }

        function applyOffset (v7Options, v7Params) {
            if (v7Options.offset > 0) {
                v7Params.$offset = v7Options.offset;
            }
        }

        function applyExpand (v7Options, v7Params) {
            if (angular.isDefined(v7Options.expansion)) {
                v7Params.$expand = 1;
            }
        }

        function applyFilter (v7Options, action) {
            if (angular.isArray(v7Options.filters)) {
                v7Options.filters.forEach(function (filter) {
                    var filterParamName = [filter.field, filter.comparator].join(":");
                    action.params[filterParamName] = angular.isArray(filter.reference) ? filter.reference.join(",") : filter.reference;
                });
            }
        }

        function applySort (v7Options, v7Params) {
            if (v7Options.sort) {
                v7Params.$sort = v7Options.sort.field;
                v7Params.$order = v7Options.sort.order;
            }
        }

        function applyBatch (v7Options, v7Params, action) {
            if (v7Options.batch) {
                v7Params.$batch = v7Options.batch.separator;
                delete action.params[v7Options.batch.parameter];
                action.options.isArray = true;
                action.options.url = action.options.url.replace(":" + v7Options.batch.parameter, v7Options.batch.values.join(v7Options.batch.separator));
            }
        }

        function applyAggregation (v7Options, v7Params, action) {
            // TODO --> verify if apiv7 can aggregation more than one parameter?
            if (v7Options.aggregation) {
                v7Params.$aggreg = 1;
                action.params[v7Options.aggregation] = undefined;
                action.options.isArray = true;
                action.options.transformResponse = apiv7AggregationResponseTransformer.create(action.options, v7Options.aggregation);
                if (action.options.url) {
                    action.options.url = action.options.url.replace(":" + v7Options.aggregation, "*");
                }
            }
        }

        return {
            /**
             * @param {Object} params
             * @param {Object} actionOptions
             * @param {Object} v7Options
             * @returns {{options: (*|Object), params: (*|{})}}
             */
            buildAction: function (params, actionOptions, v7Options) {
                var action = {
                    params: angular.copy(params),
                    options: angular.copy(actionOptions)
                };
                var v7Params = {};
                _.merge(action.options, {
                    headers: {
                        "X-Ovh-ApiVersion": "beta"
                    },
                    serviceType: "apiv7"
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
            }
        };
    }]);

angular.module("ovh-angular-apiv7").factory("Apiv7Request", ["$resource", "apiv7RequestUpgrader", function ($resource, apiv7RequestUpgrader) {
    "use strict";

    /**
         * @ngdoc service
         * @name ovh-angular-apiv7.Apiv7Request
         * @description
         * # Apiv7Request
         *
         * This object is normally created by invoking the methods of an {@link ovh-angular-apiv7.Apiv7Endpoint}.
         * Each Apiv7Request represents a request configuration that can be customised by
         * method chaining to implement various APIv7 options.
         *
         * When executed, an Apiv7Request returns a {@link https://docs.angularjs.org/api/ngResource/service/$resource $resource}
         * instance. The Apiv7Request object can be executed several times and returns a distinct $resource instance
         * each time.
         *
         * @constructor
         * @param {String} defaultUrl url for requests, overridden by action's url.
         * @param {Object} defaultParams default parameter mapping
         * @param {Object} actionOptions actions configuration
         * @param {Object} [resourceOptions] $resource extra options
         * @param {Object} [v7Options={}] alternative configuration by parameter
         * @param {Array} [v7DisabledOperations] disabled operations, to warn developer on usage
         */
    function Apiv7Request (defaultUrl, defaultParams, actionOptions, resourceOptions, v7Options, v7DisabledOperations) {
        this.defaultUrl = defaultUrl;
        this.defaultParams = defaultParams;
        this.actionOptions = actionOptions;
        this.options = resourceOptions;
        this.v7Options = v7Options || {};
        this.v7DisabledOperations = v7DisabledOperations || [];

        if (angular.isUndefined(actionOptions.url)) {
            this.actionOptions.url = this.defaultUrl;
        }
        return this;
    }

    /**
         * @ngdoc method
         * @name ovh-angular-apiv7.Apiv7Request#expand
         * @methodOf ovh-angular-apiv7.Apiv7Request
         * @description
         *  Expand a list by returning the value of the objects instead of their ids.
         * @param {Boolean} [toggle=true] Enables expansion (defaults to true)
         * @returns {Apiv7Request} new instance
         */
    Apiv7Request.prototype.expand = function (toggle) {
        var clone = this.clone();
        clone.v7Options.expansion = angular.isDefined(toggle) ? toggle : true;
        return clone;
    };

    /**
         * @ngdoc method
         * @name ovh-angular-apiv7.Apiv7Request#sort
         * @methodOf ovh-angular-apiv7.Apiv7Request
         * @description
         *  Sort results by any sortable field and order (ASC or DESC); unsets existing sort if field is unset.
         * @param {String} field the property to sort on
         * @param {String} [order="ASC"] the order of sort (ASC|DESC)
         * @returns {Apiv7Request} new instance
         */
    Apiv7Request.prototype.sort = function (field, rawOrder) {
        var clone = this.clone();
        var order = rawOrder || "ASC";
        if (!field || field === "") {
            clone.v7Options.sort = undefined;
            return clone;
        }

        clone.v7Options.sort = {
            field: field,
            order: order.toUpperCase()
        };
        return clone;
    };

    /**
         * @ngdoc method
         * @name ovh-angular-apiv7.Apiv7Request#setFilter
         * @methodOf ovh-angular-apiv7.Apiv7Request
         * @description
         *  Set a filter on a field to compare it with a reference; unsets existing filters if field is unset, false or empty string.
         * @param {String} field property to filter on
         * @param {String} comparator the operator used to compare the field with reference
         * @param {String|Number|Array} reference value to compare with
         * @returns {Apiv7Request} new instance
         * @see APIV7_FILTER_COMPARATOR
         */
    Apiv7Request.prototype.setFilter = function (field, comparator, reference) {
        var clone = this.clone();
        if (!field) {
            delete clone.v7Options.filters;
            return clone;
        }

        clone.v7Options.filters = [
            {
                field: field,
                comparator: comparator,
                reference: angular.isArray(reference) ? reference.join(",") : reference
            }
        ];
        return clone;
    };

    Apiv7Request.prototype.filter = Apiv7Request.prototype.setFilter;

    /**
         * @ngdoc method
         * @name ovh-angular-apiv7.Apiv7Request#addFilter
         * @methodOf ovh-angular-apiv7.Apiv7Request
         * @description
         *  Add a filter on a field to compare it with a reference.
         * @param {String} field property to filter on
         * @param {String} comparator the operator used to compare the field with reference. See {@link APIV7_FILTER_COMPARATOR available comparators}
         * @param {String|Number|Array} reference value to compare with
         * @returns {Apiv7Request} new instance
         * @see APIV7_FILTER_COMPARATOR
         */
    Apiv7Request.prototype.addFilter = function (field, comparator, reference) {
        var clone = this.clone();
        clone.v7Options.filters = clone.v7Options.filters || [];
        clone.v7Options.filters.push({
            field: field,
            comparator: comparator,
            reference: reference
        });
        return clone;
    };

    /**
         * @ngdoc method
         * @name ovh-angular-apiv7.Apiv7Request#batch
         * @methodOf ovh-angular-apiv7.Apiv7Request
         * @description
         *  Retrieves a list of object by batching several parameters in the same request.
         * @param {String} parameter parameter to batch for multiple ids.
         * @param {Array} values ids to retrieve
         * @param {String} [separator=","] separator used to join id list.
         * @returns {Apiv7Request} new instance
         */
    Apiv7Request.prototype.batch = function (parameter, values, separator) {
        // TODO - write unit test
        var clone = this.clone();
        clone.v7Options.batch = {
            parameter: parameter,
            values: values,
            separator: separator || ","
        };
        return clone;
    };

    /**
         * @ngdoc method
         * @name ovh-angular-apiv7.Apiv7Request#aggregate
         * @methodOf ovh-angular-apiv7.Apiv7Request
         * @description
         *  Aggregation using a wildcard parameter in the url. Disables aggregation if parameter is falsy.
         * @param {String} parameterToWildcard parameter on which to aggregate with wildcard
         * @returns {Apiv7Request} new instance
         */
    Apiv7Request.prototype.aggregate = function (parameterToWildcard) {
        var clone = this.clone();
        clone.v7Options.aggregation = angular.isString(parameterToWildcard) ? parameterToWildcard : undefined;
        return clone;
    };

    /**
         * @ngdoc method
         * @name ovh-angular-apiv7.Apiv7Request#limit
         * @methodOf ovh-angular-apiv7.Apiv7Request
         * @description
         *  Limit the amount of items returned in a list or aggregated result
         * @param {Number} limit maximum number of items to retrieve
         * @returns {Apiv7Request} new instance
         */
    Apiv7Request.prototype.limit = function (limit) {
        var clone = this.clone();
        clone.v7Options.limit = limit;
        return clone;
    };

    /**
         * @ngdoc method
         * @name ovh-angular-apiv7.Apiv7Request#offset
         * @methodOf ovh-angular-apiv7.Apiv7Request
         * @description
         *  Start enumeration of objects returned in a list result at this offset
         * @param {Number} offset skip ahead this number of items before retrieving
         * @returns {Apiv7Request} new instance
         */
    Apiv7Request.prototype.offset = function (offset) {
        var clone = this.clone();
        clone.v7Options.offset = offset;
        return clone;
    };

    /**
         * @ngdoc method
         * @name ovh-angular-apiv7.Apiv7Request#execute
         * @methodOf ovh-angular-apiv7.Apiv7Request
         * @description
         *  Applies all configuration and return a {@link https://docs.angularjs.org/api/ngResource/service/$resource $resource}
         *  instance with the pending query results.
         * @param {Object} params to inject in url template and query string
         * @returns {$resource} a {@link https://docs.angularjs.org/api/ngResource/service/$resource $resource} instance
         * @see ngResource
         */
    Apiv7Request.prototype.execute = function (params) {
        // TODO - disable check in prod
        assertV7OptionsAllowed(this.v7Options, this.v7DisabledOperations);
        var urlParams = angular.extend({}, params);
        var action = apiv7RequestUpgrader.buildAction(urlParams, this.actionOptions, this.v7Options);
        var res = $resource(this.defaultUrl, this.defaultParams, { doRequest: action.options }, this.options);
        return res.doRequest(action.params);
    };

    /**
         * @returns {Apiv7Request} new instance
         * @private
         */
    Apiv7Request.prototype.clone = function () {
        return angular.copy(this);
    };

    /* jshint latedef: false */
    function assertV7OptionsAllowed (v7Options, v7DisabledOperations) {
        _.forEach(v7Options, function (value, operationName) {
            assertUsageAllowed(operationName, v7DisabledOperations);
        });
    }

    function assertUsageAllowed (operationName, v7DisabledOperations) {
        if (v7DisabledOperations.indexOf(operationName) !== -1) {
            throw new Error("This action does not support the APIv7 '" + operationName + "' operation");
        }
    }
    /* jshint latedef: true */

    return Apiv7Request;
}]);
