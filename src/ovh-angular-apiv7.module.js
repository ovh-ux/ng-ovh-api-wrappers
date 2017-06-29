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
