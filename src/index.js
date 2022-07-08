/**
 * @ngdoc overview
 * @name ng-ovh-api-wrappers
 * @description
 * # ng-ovh-api-wrappers
 */

import angular from 'angular';
import 'angular-resource';
import { API_ENDPOINT_DEFAULT_ACTIONS } from './common/endpoint.constants';
import ApiEndpointFactory from './common/endpoint.factory';
import ApiRequestFactory from './common/request.factory';
import icebergService from './iceberg/service';
import ApiIcebergRequestUpgraderService from './iceberg/request-upgrader.service';

const moduleName = 'ngOvhApiWrappers';

angular
  .module(moduleName, [
    'ngResource',
  ])
  .constant('API_ENDPOINT_DEFAULT_ACTIONS', API_ENDPOINT_DEFAULT_ACTIONS)
  .factory('ApiEndpoint', ApiEndpointFactory)
  .factory('ApiRequest', ApiRequestFactory)
  .service('iceberg', icebergService)
  .service('apiIcebergRequestUpgrader', ApiIcebergRequestUpgraderService);

export default moduleName;
