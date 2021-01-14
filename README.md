# regression-tests

[![CircleCI](https://circleci.com/gh/thebiggive/regression-tests.svg?style=svg)](https://circleci.com/gh/thebiggive/regression-tests)

## Local Development

### Framework

These tests use [Webdriver.io](https://webdriver.io/) in
[sync mode](https://webdriver.io/docs/sync-vs-async.html). This means
browser-native promises are awaited automatically – please check the docs
if you've not used it before.

### Prerequisite setup
Make sure you have latest Yarn and Node installed and follow the detailed instructions for your OS [here](https://github.com/nodejs/node-gyp) 

### Install project

```
yarn install
```

### Configure env

* `cp .env.dist .env`
* Populate needed variables in `.env`

### Run locally

Make sure you have the correct `Chromedriver` version for your Chrome installed.
```
yarn test:local
```

## Test runs on CI

These are configured and scheduled [with CircleCI](./circle.yml).

The runner is now TestingBot where we have an open source plan. For now we are running against a recent stable Chrome version only.
