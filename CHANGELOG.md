# Changelog

## [0.2.1](https://github.com/xseman/log4js-appender-sentry/compare/v0.2.0...v0.2.1) (2026-10-21)


### Documentation

* replace the drawio diagram with a mermaid sequence diagram ([9e0f779](https://github.com/xseman/log4js-appender-sentry/commit/9e0f7799e15bf79b8db045854138ad5960852a1a))

## [0.2.0](https://github.com/xseman/log4js-appender-sentry/compare/v0.1.2...v0.2.0) (2026-10-21)


### ⚠ BREAKING CHANGES

* @sentry/node v11 requires Node.js >=20.19 or >=22.12. ConfigError and the no-op levels option are removed.

### Features

* upgrade @sentry/node to v11 ([d910298](https://github.com/xseman/log4js-appender-sentry/commit/d910298b048dd45319c445a99c01265c6cbdaffd))


### Bug Fixes

* bound appender shutdown by shutdownTimeout ([4ed492f](https://github.com/xseman/log4js-appender-sentry/commit/4ed492f8a5ac187e8259df1c3e964259c2e5513b))


### Build System

* bump dev dependencies & dprint plugins ([c9213a7](https://github.com/xseman/log4js-appender-sentry/commit/c9213a7c159ab4330aa7766d5da481ecca1d4ba6))
* drop bunfig.toml, pass ./src to bun test ([b06b3b7](https://github.com/xseman/log4js-appender-sentry/commit/b06b3b7338fbe7eca9569c8b3cb059456a0ac88f))
* migrate to bun, publish via npm trusted publisher & fix shutdown ([#6](https://github.com/xseman/log4js-appender-sentry/issues/6)) ([b2b67ad](https://github.com/xseman/log4js-appender-sentry/commit/b2b67ad9b35faf1dbfcb9b44d495495dca2bb419))


### Maintenance

* bump GitHub Actions to latest majors ([f45f364](https://github.com/xseman/log4js-appender-sentry/commit/f45f3642cbc713b0b8dae5a6a0616d433994fd4f))
* update vscode settings ([60e5abf](https://github.com/xseman/log4js-appender-sentry/commit/60e5abfbca400e58f221e8c396e006c57770e033))

## [0.1.2](https://github.com/xseman/log4js-appender-sentry/compare/v0.1.1...v0.1.2) (2025-03-31)


### Maintenance

* dependencies & config maintenance ([#4](https://github.com/xseman/log4js-appender-sentry/issues/4)) ([2ca7713](https://github.com/xseman/log4js-appender-sentry/commit/2ca77135ec59f6fe1c60ea6e77a647622e52db06))

## [0.1.1](https://github.com/xseman/log4js-appender-sentry/compare/v0.1.0...v0.1.1) (2024-10-24)


### Dependency updates

* bump sentry/node ([29e6e02](https://github.com/xseman/log4js-appender-sentry/commit/29e6e02658364582bb6662a0002999d2f1cc53da))
* upgrade @sentry/node & dev deps, move log4js to peerDeps ([9eefef7](https://github.com/xseman/log4js-appender-sentry/commit/9eefef70272bd66f4f93af18f15863bdce4aecf1))


### Documentation

* add diagram ([eee88ed](https://github.com/xseman/log4js-appender-sentry/commit/eee88ed51ea628511dc01bfb59aba45fb4b7a1d8))


### Maintenance

* add manuall publish dispatch ([11d707e](https://github.com/xseman/log4js-appender-sentry/commit/11d707e64682f6629f6f4bc37d65dd9edf89a5d7))
* bump packages, workflows & configs ([98d3ac3](https://github.com/xseman/log4js-appender-sentry/commit/98d3ac3fcc49683d045a6226a1c6da0d4e82c763))
* **chore:** update job source name ([8ee188d](https://github.com/xseman/log4js-appender-sentry/commit/8ee188d085f96cec1f48b17be16c593dd90bbd11))

## [0.1.0](https://github.com/arch-group/log4js-appender-sentry/compare/v0.0.1...v0.1.0) (2024-02-25)


### Features

* add typescript, other improvements ([07f464c](https://github.com/arch-group/log4js-appender-sentry/commit/07f464c81aad9cb1b445a6e27d1257ae3ea52534))


### Maintenance

* add configs & formatter ([ef0aa2b](https://github.com/arch-group/log4js-appender-sentry/commit/ef0aa2bfcf8967ce81546b72d858558a3fbdfab1))
* add release ([70f4ca1](https://github.com/arch-group/log4js-appender-sentry/commit/70f4ca1ef673afca361ee9907b457856fe0d4f68))
* update package meta ([1ad88e2](https://github.com/arch-group/log4js-appender-sentry/commit/1ad88e24bfe58c14c8cdd745deb470802a832ab4))
