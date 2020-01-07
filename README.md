## Description

Povio Labs NodeJS Test Assignment 1.0

## Installation

```bash
$ brew install postgresql
$ createdb -h localhost -p 5432 -U postgres povio-node-development
$ npm install
```

## Running the app

Create `.env` file based on `.ev.sample`.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

Create `.env.test` file based on `.ev.sample`.

```bash
# unit tests
$ npm run test

# e2e tests
$ createdb -h localhost -p 5432 -U postgres povio-node-test
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
