export default /* @ngInject */ function (ApiEndpoint) {
  /**
   * @ngdoc service
   * @name ng-ovh-apiv7.iceberg
   * @description
   * # iceberg
   *
   * Provides sugar to creates a ApiEndpoint without the new operator.
   *
   * @see ApiEndpoint
   */
  return function iceberg(defaultUrl, defaultParams, actions, resourceOptions) {
    return new ApiEndpoint(defaultUrl, defaultParams, actions, resourceOptions, 'Iceberg');
  };
}
