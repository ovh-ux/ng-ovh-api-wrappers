# ng-ovh-apiv7

> AngularJS component designed to configure Apiv7Endpoints with the same interface as a $resource yet allow for extended configuration by providing Apiv7Requests objects that can be modified with chained methods to define the parameters sent to APIv7.

[![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-apiv7)](https://npmjs.com/package/@ovh-ux/ng-ovh-apiv7) [![Dependencies](https://badgen.net/david/dep/ovh-ux/ng-ovh-apiv7)](https://npmjs.com/package/@ovh-ux/ng-ovh-apiv7?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/ng-ovh-apiv7)](https://npmjs.com/package/@ovh-ux/ng-ovh-apiv7?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

## Install

```sh
yarn add @ovh-ux/ng-ovh-apiv7
```

## Usage

```js
import angular from 'angular';
import ngOvhApiv7 from '@ovh-ux/ng-ovh-apiv7';

angular
  .module('myApp', [
    ngOvhApiv7,
  ]);
```

## Test

```sh
yarn test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh-ux/ng-ovh-apiv7/issues/new) or working on some of the [open issues](https://github.com/ovh-ux/ng-ovh-apiv7/issues), our [contributing guide](CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
