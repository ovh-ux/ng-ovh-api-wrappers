import angular from 'angular';
import forEach from 'lodash/forEach';
import get from 'lodash/get';

export default /* @ngInject */ function (
  $resource,
  apiIcebergRequestUpgrader,
  apiv7RequestUpgrader,
) {
  /**
   * @ngdoc service
   * @name ng-ovh-apiv7.Apiv7Request
   * @description
   * # Apiv7Request
   *
   * This object is normally created by invoking the methods of an
   * {@link ng-ovh-apiv7.Apiv7Endpoint}.
   * Each Apiv7Request represents a request configuration that can be customised by
   * method chaining to implement various APIv7 options.
   *
   * When executed, an Apiv7Request returns a {@link https://docs.angularjs.org/api/ngResource/service/$resource $resource}
   * instance. The Apiv7Request object can be executed several times and returns a distinct
   * $resource instance
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
  function Apiv7Request(defaultUrl, defaultParams, actionOptions, resourceOptions, v7Options,
    v7DisabledOperations, serviceType) {
    this.defaultUrl = defaultUrl;
    this.defaultParams = defaultParams;
    this.actionOptions = actionOptions;
    this.options = resourceOptions;
    this.v7Options = v7Options || {};
    this.v7DisabledOperations = v7DisabledOperations || [];
    this.serviceType = serviceType;

    this.requestManagers = {
      apiv7RequestUpgrader,
      apiIcebergRequestUpgrader,
    };

    if (angular.isUndefined(actionOptions.url)) {
      this.actionOptions.url = this.defaultUrl;
    }
    return this;
  }

  function assertUsageAllowed(operationName, v7DisabledOperations) {
    if (v7DisabledOperations.indexOf(operationName) !== -1) {
      throw new Error(`This action does not support the APIv7 '${operationName}' operation`);
    }
  }

  function assertV7OptionsAllowed(v7Options, v7DisabledOperations) {
    forEach(v7Options, (value, operationName) => {
      assertUsageAllowed(operationName, v7DisabledOperations);
    });
  }

  /**
   * @ngdoc method
   * @name ng-ovh-apiv7.Apiv7Request#expand
   * @methodOf ng-ovh-apiv7.Apiv7Request
   * @description
   *  Expand a list by returning the value of the objects instead of their ids.
   * @param {Boolean} [toggle=true] Enables expansion (defaults to true)
   * @returns {Apiv7Request} new instance
   */
  Apiv7Request.prototype.expand = function (toggle) {
    const clone = this.clone();
    clone.v7Options.expansion = angular.isDefined(toggle) ? toggle : true;
    return clone;
  };

  /**
   * @ngdoc method
   * @name ng-ovh-apiv7.Apiv7Request#sort
   * @methodOf ng-ovh-apiv7.Apiv7Request
   * @description
   *  Sort results by any sortable field and order (ASC or DESC);
   *  unsets existing sort if field is unset.
   * @param {String} field the property to sort on
   * @param {String} [order="ASC"] the order of sort (ASC|DESC)
   * @returns {Apiv7Request} new instance
   */
  Apiv7Request.prototype.sort = function (field, rawOrder) {
    const clone = this.clone();
    const order = rawOrder || 'ASC';
    if (!field || field === '') {
      clone.v7Options.sort = undefined;
      return clone;
    }

    clone.v7Options.sort = {
      field,
      order: order.toUpperCase(),
    };
    return clone;
  };

  /**
   * @ngdoc method
   * @name ng-ovh-apiv7.Apiv7Request#setFilter
   * @methodOf ng-ovh-apiv7.Apiv7Request
   * @description
   *  Set a filter on a field to compare it with a reference;
   *  unsets existing filters if field is unset, false or empty string.
   * @param {String} field property to filter on
   * @param {String} comparator the operator used to compare the field with reference
   * @param {String|Number|Array} reference value to compare with
   * @returns {Apiv7Request} new instance
   * @see APIV7_FILTER_COMPARATOR
   */
  Apiv7Request.prototype.setFilter = function (field, comparator, reference) {
    const clone = this.clone();
    if (!field) {
      delete clone.v7Options.filters;
      return clone;
    }

    clone.v7Options.filters = [
      {
        field,
        comparator,
        reference: angular.isArray(reference) ? reference.join(',') : reference,
      },
    ];
    return clone;
  };

  Apiv7Request.prototype.filter = Apiv7Request.prototype.setFilter;

  /**
   * @ngdoc method
   * @name ng-ovh-apiv7.Apiv7Request#addFilter
   * @methodOf ng-ovh-apiv7.Apiv7Request
   * @description
   *  Add a filter on a field to compare it with a reference.
   * @param {String} field property to filter on
   * @param {String} comparator the operator used to compare the field with reference.
   * See {@link APIV7_FILTER_COMPARATOR available comparators}
   * @param {String|Number|Array} reference value to compare with
   * @returns {Apiv7Request} new instance
   * @see APIV7_FILTER_COMPARATOR
   */
  Apiv7Request.prototype.addFilter = function (field, comparator, reference) {
    const clone = this.clone();
    clone.v7Options.filters = clone.v7Options.filters || [];
    clone.v7Options.filters.push({
      field,
      comparator,
      reference,
    });
    return clone;
  };

  /**
   * @ngdoc method
   * @name ng-ovh-apiv7.Apiv7Request#batch
   * @methodOf ng-ovh-apiv7.Apiv7Request
   * @description
   *  Retrieves a list of object by batching several parameters in the same request.
   * @param {String} parameter parameter to batch for multiple ids.
   * @param {Array} values ids to retrieve
   * @param {String} [separator=","] separator used to join id list.
   * @returns {Apiv7Request} new instance
   */
  Apiv7Request.prototype.batch = function (parameter, values, separator) {
    // TODO - write unit test
    const clone = this.clone();
    clone.v7Options.batch = {
      parameter,
      values,
      separator: separator || ',',
    };
    return clone;
  };

  /**
   * @ngdoc method
   * @name ng-ovh-apiv7.Apiv7Request#aggregate
   * @methodOf ng-ovh-apiv7.Apiv7Request
   * @description
   *  Aggregation using a wildcard parameter in the url. Disables aggregation if parameter is falsy.
   * @param {String} parameterToWildcard parameter on which to aggregate with wildcard
   * @returns {Apiv7Request} new instance
   */
  Apiv7Request.prototype.aggregate = function (parameterToWildcard) {
    const clone = this.clone();
    if (!angular.isArray(clone.v7Options.aggregation)) {
      clone.v7Options.aggregation = [];
    }

    if (angular.isString(parameterToWildcard)) {
      clone.v7Options.aggregation.push(parameterToWildcard);
    }

    return clone;
  };

  /**
   * @ngdoc method
   * @name ng-ovh-apiv7.Apiv7Request#limit
   * @methodOf ng-ovh-apiv7.Apiv7Request
   * @description
   *  Limit the amount of items returned in a list or aggregated result
   * @param {Number} limit maximum number of items to retrieve
   * @returns {Apiv7Request} new instance
   */
  Apiv7Request.prototype.limit = function (limit) {
    const clone = this.clone();
    clone.v7Options.limit = limit;
    return clone;
  };

  /**
   * @ngdoc method
   * @name ng-ovh-apiv7.Apiv7Request#offset
   * @methodOf ng-ovh-apiv7.Apiv7Request
   * @description
   *  Start enumeration of objects returned in a list result at this offset
   * @param {Number} offset skip ahead this number of items before retrieving
   * @returns {Apiv7Request} new instance
   */
  Apiv7Request.prototype.offset = function (offset) {
    const clone = this.clone();
    clone.v7Options.offset = offset;
    return clone;
  };

  /**
   * @ngdoc method
   * @name ng-ovh-apiv7.Apiv7Request#execute
   * @methodOf ng-ovh-apiv7.Apiv7Request
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
    const urlParams = angular.extend({}, params);
    const requestManager = this.requestManagers[`api${this.serviceType}RequestUpgrader`];
    const action = get(
      requestManager,
      'constructor.buildAction',
      requestManager.buildAction,
    )(urlParams, this.actionOptions, this.v7Options);
    const res = $resource(
      this.defaultUrl,
      this.defaultParams,
      { doRequest: action.options },
      this.options,
    );
    return res.doRequest(action.params);
  };

  /**
   * @returns {Apiv7Request} new instance
   * @private
   */
  Apiv7Request.prototype.clone = function () {
    return angular.copy(this);
  };

  return Apiv7Request;
}
