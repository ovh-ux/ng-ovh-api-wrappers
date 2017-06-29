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
    .service("apiv7RequestUpgrader", function (apiv7AggregationResponseTransformer) {
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
    });
