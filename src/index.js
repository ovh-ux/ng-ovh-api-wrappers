/**
 * @ngdoc overview
 * @name ng-ovh-api-wrappers
 * @description
 * # ng-ovh-api-wrappers
 *
 * The ng-ovh-api-wrappers module is an angular component designed to configure
 * {@link ng-ovh-api-wrappers.ApiEndpoint Apiv7Endpoints}
 * with the same interface as a $resource yet allow for extended configuration by providing
 * {@link ng-ovh-api-wrappers.ApiRequest Apiv7Requests}
 *  objects that can be modified with chained methods to define the parameters sent to APIv7.
 */

import angular from 'angular';
import 'angular-resource';
import { API_ENDPOINT_DEFAULT_ACTIONS } from './common/endpoint.constants';
import ApiEndpointFactory from './common/endpoint.factory';
import ApiRequestFactory from './common/request.factory';
import icebergService from './iceberg/service';
import v7Service from './v7/service';
import AggregationResponseTransformerService from './v7/aggregation-response-transformer.service';
import Apiv7RequestUpgraderService from './v7/request-upgrader.service';
import ApiIcebergRequestUpgraderService from './iceberg/request-upgrader.service';

const moduleName = 'ngOvhApiWrappers';

angular
  .module(moduleName, [
    'ngResource',
  ])
  .constant('API_ENDPOINT_DEFAULT_ACTIONS', API_ENDPOINT_DEFAULT_ACTIONS)
  .factory('ApiEndpoint', ApiEndpointFactory)
  .factory('ApiRequest', ApiRequestFactory)
  .service('apiv7', v7Service)
  .service('iceberg', icebergService)
  .service('apiv7AggregationResponseTransformer', AggregationResponseTransformerService)
  .service('apiv7RequestUpgrader', Apiv7RequestUpgraderService)
  .service('apiIcebergRequestUpgrader', ApiIcebergRequestUpgraderService);

export default moduleName;
