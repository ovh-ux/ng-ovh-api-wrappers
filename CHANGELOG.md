# [5.0.0](https://github.com/ovh-ux/ng-ovh-api-wrappers/compare/v4.0.11...v5.0.0) (2022-07-08)


### Code Refactoring

* drop APIv7 support ([#72](https://github.com/ovh-ux/ng-ovh-api-wrappers/issues/72)) ([6c97aa8](https://github.com/ovh-ux/ng-ovh-api-wrappers/commit/6c97aa8d96091e098f2b3aa01caf69f59a94cfb5))


### BREAKING CHANGES

* drop APIv7 support



## [4.0.11](https://github.com/ovh-ux/ng-ovh-api-wrappers/compare/v4.0.10...v4.0.11) (2022-03-25)



## [4.0.10](https://github.com/ovh-ux/ng-ovh-api-wrappers/compare/v4.0.9...v4.0.10) (2021-12-01)


### Bug Fixes

* addFilter setFilter parameters ([#65](https://github.com/ovh-ux/ng-ovh-api-wrappers/issues/65)) ([1b90636](https://github.com/ovh-ux/ng-ovh-api-wrappers/commit/1b906361ba88023e39ed2e78aeda0796ae5c96d0))



## [4.0.9](https://github.com/ovh-ux/ng-ovh-api-wrappers/compare/v4.0.8...v4.0.9) (2021-11-08)


### Bug Fixes

* **iceberg:** encodeURIComponent filter values ([#64](https://github.com/ovh-ux/ng-ovh-api-wrappers/issues/64)) ([e4138de](https://github.com/ovh-ux/ng-ovh-api-wrappers/commit/e4138de1d958b83fb7c6c80caaf3e9291f3c1ae2))



## [4.0.8](https://github.com/ovh-ux/ng-ovh-api-wrappers/compare/v4.0.7...v4.0.8) (2020-08-18)


### Bug Fixes

* **deps:** add some resolutions ([e755fb3](https://github.com/ovh-ux/ng-ovh-api-wrappers/commit/e755fb3821c19db302f78fc2c68719fc4aeea27b))



## [4.0.7](https://github.com/ovh-ux/ng-ovh-api-wrappers/compare/v4.0.6...v4.0.7) (2020-03-16)



## [4.0.6](https://github.com/ovh-ux/ng-ovh-api-wrappers/compare/v4.0.5...v4.0.6) (2020-01-08)



## [4.0.5](https://github.com/ovh-ux/ng-ovh-api-wrappers/compare/v4.0.4...v4.0.5) (2019-11-08)



## [4.0.4](https://github.com/ovh-ux/ng-ovh-api-wrappers/compare/v4.0.3...v4.0.4) (2019-08-30)


### Bug Fixes

* **deps:** upgrade component-rollup-config to v6.0.2 ([#40](https://github.com/ovh-ux/ng-ovh-api-wrappers/issues/40)) ([20ca5d7](https://github.com/ovh-ux/ng-ovh-api-wrappers/commit/20ca5d7))



## [4.0.3](https://github.com/ovh-ux/ng-ovh-api-wrappers/compare/v4.0.2...v4.0.3) (2019-08-27)



## [4.0.2](https://github.com/ovh-ux/ng-ovh-api-wrappers/compare/v4.0.1...v4.0.2) (2019-07-16)



## [4.0.1](https://github.com/ovh-ux/ng-ovh-api-wrappers/compare/v4.0.0...v4.0.1) (2019-07-09)


### Bug Fixes

* **iceberg:** parse response data ([#21](https://github.com/ovh-ux/ng-ovh-api-wrappers/issues/21)) ([34c7bac](https://github.com/ovh-ux/ng-ovh-api-wrappers/commit/34c7bac))



# [4.0.0](https://github.com/ovh-ux/ng-ovh-api-wrappers/compare/v3.0.0...v4.0.0) (2019-07-04)


### Features

* **iceberg:** return response headers ([#15](https://github.com/ovh-ux/ng-ovh-api-wrappers/issues/15)) ([280ead4](https://github.com/ovh-ux/ng-ovh-api-wrappers/commit/280ead4))


### BREAKING CHANGES

* **iceberg:** change response type to return headers
  Before:
   returned data
  After:
   returns an object formatted like `{ data, headers, status }`



# [3.0.0](https://github.com/ovh-ux/ng-ovh-api-wrappers/compare/v2.0.0...v3.0.0) (2019-03-06)


### Features

* **iceberg:** add request support ([5f37d62](https://github.com/ovh-ux/ng-ovh-api-wrappers/commit/5f37d62))
* add expand with iceberg ([22f72ad](https://github.com/ovh-ux/ng-ovh-api-wrappers/commit/22f72ad))
* **iceberg:** handle cache cleaning ([3e5a776](https://github.com/ovh-ux/ng-ovh-api-wrappers/commit/3e5a776))
* **iceberg:** handle cursor mode offset ([cd416fa](https://github.com/ovh-ux/ng-ovh-api-wrappers/commit/cd416fa))
* **iceberg:** manage iceberg filters ([5d2b0f5](https://github.com/ovh-ux/ng-ovh-api-wrappers/commit/5d2b0f5))
* **iceberg:** update descriptions ([5faa71a](https://github.com/ovh-ux/ng-ovh-api-wrappers/commit/5faa71a))
* rename module ([aa30929](https://github.com/ovh-ux/ng-ovh-api-wrappers/commit/aa30929))


### BREAKING CHANGES

* module is now named as `ngOvhApiWrappers`



# [2.0.0](https://github.com/ovh-ux/ng-ovh-api-wrappers/compare/v1.2.8...v2.0.0) (2019-02-19)


### Bug Fixes

* remove jshint and jscs ([d880ec2](https://github.com/ovh-ux/ng-ovh-api-wrappers/commit/d880ec2))


### Code Refactoring

* update stack with component-rollup-config ([fbe0fea](https://github.com/ovh-ux/ng-ovh-api-wrappers/commit/fbe0fea))


### BREAKING CHANGES

* module is now named as `ngOvhApiv7`



## [1.2.8](https://github.com/ovh-ux/ng-ovh-api-wrappers/compare/v1.2.5...v1.2.8) (2018-06-14)


### Bug Fixes

* fix test task ([1f191ed](https://github.com/ovh-ux/ng-ovh-api-wrappers/commit/1f191ed))



## [1.2.5](https://github.com/ovh-ux/ng-ovh-api-wrappers/compare/v1.2.4...v1.2.5) (2018-06-14)



## [1.2.4](https://github.com/ovh-ux/ng-ovh-api-wrappers/compare/v1.2.3...v1.2.4) (2018-06-14)



## [1.2.3](https://github.com/ovh-ux/ng-ovh-api-wrappers/compare/1.2.3...v1.2.3) (2018-04-18)



## [1.2.2](https://github.com/ovh-ux/ng-ovh-api-wrappers/compare/1.2.2...v1.2.2) (2018-04-18)



## [1.2.1](https://github.com/ovh-ux/ng-ovh-api-wrappers/compare/v1.2.0...v1.2.1) (2018-04-17)


### Bug Fixes

* **package.json:** fix repository entry in package.json ([e18ed01](https://github.com/ovh-ux/ng-ovh-api-wrappers/commit/e18ed01))



# [1.2.0](https://github.com/ovh-ux/ng-ovh-api-wrappers/compare/1.1.1...v1.2.0) (2018-01-24)


### Features

* **aggregation:** add possibility to aggregate calls on multiple params ([bdfdc0f](https://github.com/ovh-ux/ng-ovh-api-wrappers/commit/bdfdc0f))



## 1.1.1 (2017-06-29)



