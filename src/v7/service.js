export default /* @ngInject */ function (Apiv7Endpoint) {
  /**
   * @ngdoc service
   * @name ng-ovh-apiv7.apiv7
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
}
