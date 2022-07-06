import forOwn from 'lodash/forOwn';
import merge from 'lodash/merge';

export default /* @ngInject */ function (ApiRequest, API_ENDPOINT_DEFAULT_ACTIONS) {
  /**
   * @ngdoc service
   * @name ng-ovh-api-wrappers.ApiEndpoint
   * @description
   * # ApiEndpoint
   *
   * For each action, ($resource defaults + custom actions specified in), a method is
   * created on the endpoint object. These methods create {@link ng-ovh-api-wrappers.ApiRequest}
   * objects which implements operations (.sort, filter, ...) and returns a $resource instance
   * on execute().
   *
   * The constructor accepts all the standard options of
   * {@link https://docs.angularjs.org/api/ngResource/service/$resource $resource} as well as
   * extra action options specific to ApiEndpoint behaviours.
   *
   *
   * @constructor
   * @param {String} defaultUrl the default url template, can be overridden in actions
   * @param {Object} defaultParams the default url parameters, can be overridden in actions
   * @param {Object} actions Declaration of custom actions.
   * @param {Object} [resourceOptions] Custom settings.
   */
  function ApiEndpoint(defaultUrl, defaultParams, actions, resourceOptions, serviceType = 'Iceberg') {
    // Creates the $resource default actions as well
    const actionToBuild = merge({}, API_ENDPOINT_DEFAULT_ACTIONS, actions);
    this.createRequestBuilders(
      defaultUrl,
      defaultParams,
      actionToBuild,
      resourceOptions,
      serviceType,
    );
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
  ApiEndpoint.prototype.createRequestBuilders = function (defaultUrl, defaultParams, actions,
    options, serviceType) {
    const self = this;
    forOwn(actions, (actionOpts, actionName) => {
      self[actionName] = function (apiOptions) {
        return new ApiRequest(
          defaultUrl,
          defaultParams,
          actionOpts,
          options,
          apiOptions,
          serviceType,
        );
      };
    });
  };

  return ApiEndpoint;
}
