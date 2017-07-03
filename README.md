![OVH component](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![NPM](https://nodei.co/npm/ovh-angular-apiv7.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-angular-apiv7/)

[![Maintenance](https://img.shields.io/maintenance/yes/2017.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux) [![Build Status](https://travis-ci.org/ovh-ux/ovh-angular-apiv7.svg)](https://travis-ci.org/ovh-ux/ovh-angular-apiv7) [![Build Status](https://travis-ci.org/ovh/ovh-angular-apiv7.svg)](https://travis-ci.org/ovh-ux/ovh-angular-apiv7)

# ovh-angular-apiv7

The ovh-angular-apiv7 module is an angular component designed to configure Apiv7Endpoints with the same interface as a
$resource yet allow for extended configuration by providing Apiv7Requests objects that can be modified with chained
methods to define the parameters sent to APIv7.

## Requirements

    - [angular](https://angularjs.org/)
    - [angular-resource](https://angularjs.org/)
    - [lodash](https://lodash.com/)
    - externally provided auth and token injection for OVH APIv6.

# Installation

## Bower

    bower install ovh-angular-apiv7 --save

## NPM

    npm install ovh-angular-apiv7 --save

# Howto's

1. In your `index.html`, inject scripts and styles

```html
 <script src="dist/ovh-angular-apiv7.min.js" type="text/javascript"></script>
```

2. In your `app.js`, add ovh-angular-apiv7 as a dependency

```javascript
angular.module("myModule", ["ovh-angular-apiv7"]);
```

3. use it like $resource (see Documentation for more)

# Documentation

    - run `grunt connect`
    - go to `http://localhost:9090/#/docs/`

## Get the sources

```bash
    git clone https://github.com/ovh-ux/ovh-angular-apiv7.git
    cd ovh-angular-apiv7
    npm install
    bower install
```

You've developed a new cool feature ? Fixed an annoying bug ? We'd be happy
to hear from you !

see [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-apiv7/blob/master/CONTRIBUTING.md)

### Build tools

    - `grunt`: to build
    - `grunt test`: to run code quality inspection tools and unit tests
    - `grunt watch`: to watch for code changes and rerun tests
    - `grunt release --type=major|minor|patch`: to release your module


# Related links

 * Contribute: [https://github.com/ovh-ux/ovh-angular-apiv7/blob/master/CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-apiv7/blob/master/CONTRIBUTING.md)
 * Report bugs: [https://github.com/ovh-ux/ovh-angular-apiv7/issues](https://github.com/ovh-ux/ovh-angular-apiv7/issues)
 * Get latest version: [https://github.com/ovh-ux/ovh-angular-apiv7](https://github.com/ovh-ux/ovh-angular-apiv7)

# License

See [https://github.com/ovh-ux/ovh-angular-apiv7/blob/master/LICENSE](https://github.com/ovh-ux/ovh-angular-apiv7/blob/master/LICENSE)
