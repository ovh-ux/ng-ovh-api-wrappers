import angular from 'angular';
import get from 'lodash/get';

export default /* @ngInject */ function (
  $resource,
  apiIcebergRequestUpgrader,
) {
  /**
   * @ngdoc service
   * @name ng-ovh-api-wrappers.ApiRequest
   * @description
   * # ApiRequest
   *
   * This object is normally created by invoking the methods of an
   * {@link ng-ovh-api-wrappers.ApiEndpoint}.
   *
   * When executed, an ApiRequest returns a {@link https://docs.angularjs.org/api/ngResource/service/$resource $resource}
   * instance. The ApiRequest object can be executed several times and returns a distinct
   * $resource instance
   * each time.
   *
   * @constructor
   * @param {String} defaultUrl url for requests, overridden by action's url.
   * @param {Object} defaultParams default parameter mapping
   * @param {Object} actionOptions actions configuration
   * @param {Object} [resourceOptions] $resource extra options
   * @param {Object} [apiOptions={}] alternative configuration by parameter
   */
  function ApiRequest(defaultUrl, defaultParams, actionOptions, resourceOptions, apiOptions,
    serviceType) {
    this.defaultUrl = defaultUrl;
    this.defaultParams = defaultParams;
    this.actionOptions = actionOptions;
    this.options = resourceOptions;
    this.apiOptions = apiOptions || {};
    this.serviceType = serviceType;
    this.apiVersion = 'apiv6';

    this.requestManagers = {
      apiIcebergRequestUpgrader,
    };

    if (angular.isUndefined(actionOptions.url)) {
      this.actionOptions.url = this.defaultUrl;
    }
    return this;
  }

  ApiRequest.prototype.setApiVersion = function (apiVersion) {
    const clone = this.clone();
    clone.apiOptions.apiVersion = angular.isString(apiVersion) ? apiVersion : 'apiv6';
    return clone;
  };

  /**
   * @ngdoc method
   * @name ng-ovh-api-wrappers.ApiRequest#expand
   * @methodOf ng-ovh-api-wrappers.ApiRequest
   * @description
   *  Expand a list by returning the value of the objects instead of their ids.
   * @param {Boolean} [toggle=true] Enables expansion (defaults to true)
   * @returns {ApiRequest} new instance
   */
  ApiRequest.prototype.expand = function (toggle) {
    const clone = this.clone();
    clone.apiOptions.expansion = angular.isDefined(toggle) ? toggle : true;
    return clone;
  };

  /**
   * @ngdoc method
   * @name ng-ovh-api-wrappers.ApiRequest#sort
   * @methodOf ng-ovh-api-wrappers.ApiRequest
   * @description
   *  Sort results by any sortable field and order (ASC or DESC);
   *  unsets existing sort if field is unset.
   * @param {String} field the property to sort on
   * @param {String} [order="ASC"] the order of sort (ASC|DESC)
   * @returns {ApiRequest} new instance
   */
  ApiRequest.prototype.sort = function (field, rawOrder) {
    const clone = this.clone();
    const order = rawOrder || 'ASC';
    if (!field || field === '') {
      clone.apiOptions.sort = undefined;
      return clone;
    }

    clone.apiOptions.sort = {
      field,
      order: order.toUpperCase(),
    };
    return clone;
  };

  /**
   * @ngdoc method
   * @name ng-ovh-api-wrappers.ApiRequest#setFilter
   * @methodOf ng-ovh-api-wrappers.ApiRequest
   * @description
   *  Set a filter on a field to compare it with a reference;
   *  unsets existing filters if field is unset, false or empty string.
   * @param {String} field property to filter on
   * @param {String} comparator the operator used to compare the field with reference
   * @param {String|Number|Array} reference value to compare with
   * @returns {ApiRequest} new instance
   */
  ApiRequest.prototype.setFilter = function (field, comparator, reference) {
    const clone = this.clone();
    if (!field) {
      delete clone.apiOptions.filters;
      return clone;
    }

    clone.apiOptions.filters = [
      {
        field,
        comparator,
        reference,
      },
    ];
    return clone;
  };

  ApiRequest.prototype.filter = ApiRequest.prototype.setFilter;

  /**
   * @ngdoc method
   * @name ng-ovh-api-wrappers.ApiRequest#addFilter
   * @methodOf ng-ovh-api-wrappers.ApiRequest
   * @description
   *  Add a filter on a field to compare it with a reference.
   * @param {String} field property to filter on
   * @param {String} comparator the operator used to compare the field with reference.
   * @param {String|Number|Array} reference value to compare with
   * @returns {ApiRequest} new instance
   */
  ApiRequest.prototype.addFilter = function (field, comparator, reference) {
    const clone = this.clone();
    clone.apiOptions.filters = clone.apiOptions.filters || [];
    clone.apiOptions.filters.push({
      field,
      comparator,
      reference,
    });
    return clone;
  };

  /**
   * @ngdoc method
   * @name ng-ovh-api-wrappers.ApiRequest#batch
   * @methodOf ng-ovh-api-wrappers.ApiRequest
   * @description
   *  Retrieves a list of object by batching several parameters in the same request.
   * @param {String} parameter parameter to batch for multiple ids.
   * @param {Array} values ids to retrieve
   * @param {String} [separator=","] separator used to join id list.
   * @returns {ApiRequest} new instance
   */
  ApiRequest.prototype.batch = function (parameter, values, separator) {
    // TODO - write unit test
    const clone = this.clone();
    clone.apiOptions.batch = {
      parameter,
      values,
      separator: separator || ',',
    };
    return clone;
  };

  /**
   * @ngdoc method
   * @name ng-ovh-api-wrappers.ApiRequest#aggregate
   * @methodOf ng-ovh-api-wrappers.ApiRequest
   * @description
   *  Aggregation using a wildcard parameter in the url. Disables aggregation if parameter is falsy.
   * @param {String} parameterToWildcard parameter on which to aggregate with wildcard
   * @returns {ApiRequest} new instance
   */
  ApiRequest.prototype.aggregate = function (parameterToWildcard) {
    const clone = this.clone();
    if (!angular.isArray(clone.apiOptions.aggregation)) {
      clone.apiOptions.aggregation = [];
    }

    if (angular.isString(parameterToWildcard)) {
      clone.apiOptions.aggregation.push(parameterToWildcard);
    }

    return clone;
  };

  /**
   * @ngdoc method
   * @name ng-ovh-api-wrappers.ApiRequest#limit
   * @methodOf ng-ovh-api-wrappers.ApiRequest
   * @description
   *  Limit the amount of items returned in a list or aggregated result
   * @param {Number} limit maximum number of items to retrieve
   * @returns {ApiRequest} new instance
   */
  ApiRequest.prototype.limit = function (limit) {
    const clone = this.clone();
    clone.apiOptions.limit = limit;
    return clone;
  };

  /**
   * @ngdoc method
   * @name ng-ovh-api-wrappers.ApiRequest#offset
   * @methodOf ng-ovh-api-wrappers.ApiRequest
   * @description
   *  Start enumeration of objects returned in a list result at this offset
   * @param {Number} offset skip ahead this number of items before retrieving
   * @returns {ApiRequest} new instance
   */
  ApiRequest.prototype.offset = function (offset) {
    const clone = this.clone();
    clone.apiOptions.offset = offset;
    return clone;
  };

  /**
   * @ngdoc method
   * @name ng-ovh-api-wrappers.ApiRequest#execute
   * @methodOf ng-ovh-api-wrappers.ApiRequest
   * @description
   *  Applies all configuration and return a {@link https://docs.angularjs.org/api/ngResource/service/$resource $resource}
   *  instance with the pending query results.
   * @param {Object} params to inject in url template and query string
   * @returns {$resource} a {@link https://docs.angularjs.org/api/ngResource/service/$resource $resource} instance
   * @see ngResource
   */
  ApiRequest.prototype.execute = function (params, cleanCache = false) {
    const urlParams = angular.extend({}, params);
    const requestManager = this.requestManagers[`api${this.serviceType}RequestUpgrader`];
    const action = get(
      requestManager,
      'constructor.buildAction',
      requestManager.buildAction,
    )(urlParams, this.actionOptions, this.apiOptions, cleanCache);
    const res = $resource(
      this.defaultUrl,
      this.defaultParams,
      { doRequest: action.options },
      this.options,
    );
    return res.doRequest(action.params);
  };

  /**
   * @returns {ApiRequest} new instance
   * @private
   */
  ApiRequest.prototype.clone = function () {
    return angular.copy(this);
  };

  return ApiRequest;
}
