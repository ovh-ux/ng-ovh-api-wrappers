# ng-ovh-api-wrappers

> AngularJS component designed to configure Api Endpoints with the same interface as a $resource yet allow for extended configuration by providing ApiRequests objects that can be modified with chained methods to define the parameters sent to APIv7 or the headers to Iceberg.

[![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-api-wrappers)](https://npmjs.com/package/@ovh-ux/ng-ovh-api-wrappers) [![Dependencies](https://badgen.net/david/dep/ovh-ux/ng-ovh-api-wrappers)](https://npmjs.com/package/@ovh-ux/ng-ovh-api-wrappers?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/ng-ovh-api-wrappers)](https://npmjs.com/package/@ovh-ux/ng-ovh-api-wrappers?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

## Install

```sh
yarn add @ovh-ux/ng-ovh-api-wrappers
```

## Usage

```js
import angular from 'angular';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';

angular
  .module('myApp', [
    ngOvhApiWrappers,
  ]);
```

## Test

```sh
yarn test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh-ux/ng-ovh-api-wrappers/issues/new) or working on some of the [open issues](https://github.com/ovh-ux/ng-ovh-api-wrappers/issues), our [contributing guide](CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
