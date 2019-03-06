export default /* @ngInject */ function (ApiEndpoint) {
  /**
   * @ngdoc service
   * @name ng-ovh-api-wrappers.apiv7
   * @description
   * # apiv7
   *
   * Provides sugar to creates a ApiEndpoint without the new operator.
   *
   * @see ApiEndpoint
   */
  return function (defaultUrl, defaultParams, actions, resourceOptions) {
    return new ApiEndpoint(defaultUrl, defaultParams, actions, resourceOptions);
  };
}
