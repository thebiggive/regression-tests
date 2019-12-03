# regression-tests

[![CircleCI](https://circleci.com/gh/thebiggive/regression-tests.svg?style=svg)](https://circleci.com/gh/thebiggive/regression-tests)

## Local Development

### Install project
```
yarn install
```

### Run tests
#### With Docker
Using Docker ensures correct Chrome version is used.
```
yarn test
```

#### With your local Chrome
Make sure you have the correct `Chromedriver` version for your Chrome installed.
```
yarn test:local
```
