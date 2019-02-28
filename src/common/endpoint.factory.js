import forOwn from 'lodash/forOwn';
import merge from 'lodash/merge';
import omit from 'lodash/omit';

export default /* @ngInject */ function (ApiRequest, API_ENDPOINT_DEFAULT_ACTIONS) {
  /**
   * @ngdoc service
   * @name ng-ovh-api-wrappers.ApiEndpoint
   * @description
   * # ApiEndpoint
   *
   * Creates ngResource endpoints that provides facilities to easily
   * leverage APIv7 functionality.
   *
   * For each action, ($resource defaults + custom actions specified in), a method is
   * created on the endpoint object. These methods create {@link ng-ovh-api-wrappers.ApiRequest}
   * objects which implements APIv7 operations (.sort, filter, ...) and returns a $resource instance
   * on execute().
   *
   * The constructor accepts all the standard options of
   * {@link https://docs.angularjs.org/api/ngResource/service/$resource $resource} as well as
   * extra action options specific to ApiEndpoint behaviours.
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
  function ApiEndpoint(defaultUrl, defaultParams, actions, resourceOptions, serviceType = 'v7') {
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
      const { disabledOperations } = actionOpts;
      const actionOptions = omit(actionOpts, 'disabledOperations');

      self[actionName] = function (apiOptions) {
        return new ApiRequest(
          defaultUrl,
          defaultParams,
          actionOptions,
          options,
          apiOptions,
          disabledOperations,
          serviceType,
        );
      };
    });
  };

  return ApiEndpoint;
}
