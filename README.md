# regression-tests

[![CircleCI](https://circleci.com/gh/thebiggive/regression-tests.svg?style=svg)](https://circleci.com/gh/thebiggive/regression-tests)

## Local Development

### Framework

These tests use [Webdriver.io](https://webdriver.io/) in
[sync mode](https://webdriver.io/docs/sync-vs-async.html). This means
browser-native promises are awaited automatically – please check the docs
if you've not used it before.

#### Future of sync mode

Unfortunately in 2021 this was [deprecated](https://webdriver.io/docs/sync-vs-async/). Node 16 does not support the way it works
and its days are now numbered, forcing us to run on Node 14 for tests through 2022.
We will need to migrate to async/await and then can update which Node runs tests.

There is a manual [migration guide](https://webdriver.io/docs/async-migration/) and now
also a [codemod](https://github.com/webdriverio/codemod/issues/1) which will hopefully make moving easy, but this need not be a top priority until early 2023. It is captured
on issue [REG-22](https://thebiggive.atlassian.net/browse/REG-22).

### Prerequisite setup
Make sure you have the latest Yarn and Node installed.
In some OS cases, when running the test for the first time, you may be prompted with further instructions to get
this set up correctly, in which case follow the detailed instructions for your OS [here](https://github.com/nodejs/node-gyp)

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
