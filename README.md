# ng-ovh-api-wrappers

> AngularJS component designed to configure Api Endpoints with the same interface as a $resource yet allow for extended configuration by providing ApiRequests objects that can be modified with chained methods to define the parameters sent to APIv7 or the headers to Iceberg.

[![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-api-wrappers)](https://npmjs.com/package/@ovh-ux/ng-ovh-api-wrappers) [![Dependencies](https://badgen.net/david/dep/ovh-ux/ng-ovh-api-wrappers)](https://npmjs.com/package/@ovh-ux/ng-ovh-api-wrappers?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/ng-ovh-api-wrappers)](https://npmjs.com/package/@ovh-ux/ng-ovh-api-wrappers?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

## Install

```sh
yarn add @ovh-ux/ng-ovh-api-wrappers
```

## Usage

```js
// index.js
import angular from 'angular';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';

angular
  .module('myApp', [
    ngOvhApiWrappers,
  ]);
```

### Api v7

Use of `apiv7` is now deprecated

### Iceberg 

#### Simple request

```js
// service.js
function getElements() {
  return iceberg('/api/elements')
    .query()
    .execute({ ...queryParams }, resetCache)
    .$promise;
}
```

Response is formatted like

<!-- eslint-skip -->
```js
{
  data // data returned by the API
  headers // response headers returned
  status // call status
}
```

#### Enable aggregation

```js
// service.js
function getAggregatedElements() {
  return iceberg('/api/elements')
    .query()
    .expand(aggregationMode)
    .execute();
}
```

`aggregationMode` can be one of those values: 
* `CachedObjectList-Cursor`
* `CachedObjectList-Pages`

#### Paginate

```js
// service.js
function getPaginatedElements() {
  return iceberg('/api/elements')
    .query()
    .expand('CachedObjectList-Pages')
    .limit(10) // get only 10 results by page
    .offset(2) // get results for page 2
    .execute();
}
```

#### Filter

```js
// service.js
function getFilteredElements() {
  return iceberg('/api/elements')
    .query()
    .expand('CachedObjectList-Pages')
    .addFilter('name', 'like', 'iceberg') // get element with name matching iceberg
    .execute();
}
```

```js
// service.js
function getFilteredElements() {
  return iceberg('/api/elements')
    .query()
    .expand('CachedObjectList-Pages')
    .addFilter('name', 'like', ['iceberg', 'awesome']) // get element with name matching iceberg and awesome
    .execute();
}
```

#### Sort

```js
// service.js
function getSortedElements() {
  return iceberg('/api/elements')
    .query()
    .expand('CachedObjectList-Pages')
    .sort('name') // sort elements by ascending names
    .execute();
}
```


```js
// service.js
function getAggregatedElements() {
  return iceberg('/api/elements')
    .query()
    .expand('CachedObjectList-Pages')
    .sort('name', 'desc') // sort elements by descending names
    .execute();
}
```
## Test

```sh
yarn test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh-ux/ng-ovh-api-wrappers/issues/new) or working on some of the [open issues](https://github.com/ovh-ux/ng-ovh-api-wrappers/issues), our [contributing guide](CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
