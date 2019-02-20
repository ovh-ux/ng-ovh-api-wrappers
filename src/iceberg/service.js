export default /* @ngInject */ function (Apiv7Endpoint) {
  /**
   * @ngdoc service
   * @name ng-ovh-apiv7.iceberg
   * @description
   * # iceberg
   *
   * Provides sugar to creates a Apiv7Endpoint without the new operator.
   *
   * @see Apiv7Endpoint
   */
  return function iceberg(defaultUrl, defaultParams, actions, resourceOptions) {
    return new Apiv7Endpoint(defaultUrl, defaultParams, actions, resourceOptions, 'Iceberg');
  };
}
