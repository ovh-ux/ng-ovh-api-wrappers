/**
 * @ngdoc overview
 * @name ng-ovh-apiv7
 * @description
 * # ng-ovh-apiv7
 *
 * The ng-ovh-apiv7 module is an angular component designed to configure
 * {@link ng-ovh-apiv7.Apiv7Endpoint Apiv7Endpoints}
 * with the same interface as a $resource yet allow for extended configuration by providing
 * {@link ng-ovh-apiv7.Apiv7Request Apiv7Requests} objects that can be modified with chained methods
 * to define the parameters sent to APIv7.
 */

import angular from 'angular';
import 'angular-resource';
import { APIV7_FILTER_COMPARATOR, APIV7_SORT_ORDER } from './constants';
import { APIV7_ENDPOINT_DEFAULT_ACTIONS } from './common/endpoint.constants';
import Apiv7EndpointFactory from './common/endpoint.factory';
import Apiv7RequestFactory from './common/request.factory';
import icebergService from './iceberg/service';
import v7Service from './v7/service';
import AggregationResponseTransformerService from './v7/aggregation-response-transformer.service';
import Apiv7RequestUpgraderService from './v7/request-upgrader.service';
import ApiIcebergRequestUpgraderService from './iceberg/request-upgrader.service';

const moduleName = 'ngOvhApiv7';

angular
  .module(moduleName, [
    'ngResource',
  ])
  .constant('APIV7_FILTER_COMPARATOR', APIV7_FILTER_COMPARATOR)
  .constant('APIV7_SORT_ORDER', APIV7_SORT_ORDER)
  .constant('APIV7_ENDPOINT_DEFAULT_ACTIONS', APIV7_ENDPOINT_DEFAULT_ACTIONS)
  .factory('Apiv7Endpoint', Apiv7EndpointFactory)
  .factory('Apiv7Request', Apiv7RequestFactory)
  .service('apiv7', v7Service)
  .service('iceberg', icebergService)
  .service('apiv7AggregationResponseTransformer', AggregationResponseTransformerService)
  .service('apiv7RequestUpgrader', Apiv7RequestUpgraderService)
  .service('apiIcebergRequestUpgrader', ApiIcebergRequestUpgraderService);

export default moduleName;
